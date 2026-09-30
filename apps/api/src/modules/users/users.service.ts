import { Injectable, NotFoundException } from '@nestjs/common';
import type { Footprint, UserProfile } from '@travelpad/contracts';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async profile(where: { id: string } | { username: string }, viewerId?: string): Promise<UserProfile> {
    const u = await this.prisma.user.findUnique({
      where,
      include: {
        _count: {
          select: {
            posts: { where: { status: 'published' } }, journeys: true, followers: true, following: true,
            reviews: { where: { content: { not: '' } } },
          },
        },
      },
    });
    if (!u) throw new NotFoundException({ code: 'USER_NOT_FOUND', message: 'Không tìm thấy người dùng' });

    const [places, ongoing, followsBack] = await Promise.all([
      this.prisma.journeyStop.findMany({ where: { journey: { ownerId: u.id }, placeId: { not: null } }, distinct: ['placeId'], select: { placeId: true } }),
      this.prisma.journey.count({ where: { ownerId: u.id, status: 'ongoing' } }),
      viewerId && viewerId !== u.id ? this.prisma.follow.count({ where: { followerId: viewerId, followingId: u.id } }) : 0,
    ]);

    return {
      id: u.id, username: u.username, displayName: u.displayName, avatarUrl: u.avatarUrl, level: u.level, accountType: u.accountType,
      bio: u.bio, coverUrl: u.coverUrl, xp: u.xp,
      stats: {
        posts: u._count.posts, journeys: u._count.journeys, places: places.length, reviews: u._count.reviews,
        followers: u._count.followers, following: u._count.following,
      },
      viewer: { isSelf: viewerId === u.id, following: followsBack > 0 },
      role: u.role,
      currentlyTraveling: ongoing > 0,
    };
  }

  async footprints(userId: string): Promise<Footprint[]> {
    const rows = await this.prisma.checkin.findMany({
      where: { userId },
      orderBy: { visitedAt: 'asc' },
      include: { place: { select: { id: true, name: true, lat: true, lng: true } } },
    });
    return rows.map((c) => ({
      placeId: c.place.id, name: c.place.name, location: { lat: c.place.lat, lng: c.place.lng },
      visitedAt: c.visitedAt.toISOString(), stayDays: c.stayDays, photoUrl: c.photoUrl,
    }));
  }
}
