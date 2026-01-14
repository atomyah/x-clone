import { Sidebar } from '@/components/home/sidebar';
import { RightSidebar } from '@/components/home/right-sidebar';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileInfo } from '@/components/profile/profile-info';
import { ProfileTabs } from '@/components/profile/profile-tabs';
import { ProfileTimeline } from '@/components/profile/profile-timeline';
import type { Post, LiveEvent, NewsItem } from '@/types/post';

const mockPosts: Post[] = [
  {
    id: 1,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年3月7日',
    content:
      'ベンゾジアゼピン問題は日本だけでなく世界中で同様です。減薬の困難性と正しい処方に関する医療界の無知が問題です。服薬中でも"いきなりやめないで"といった内容が...',
    likes: 24,
    retweets: 8,
    replies: 5,
    pinned: true,
  },
  {
    id: 2,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年3月6日',
    content:
      'ベンゾジアゼピン薬の被害実態、医学論文、減薬方法などの情報をウェブサイトと書籍で提供しています。',
    likes: 42,
    retweets: 15,
    replies: 8,
  },
  {
    id: 3,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年3月5日',
    content:
      '減薬を始める前に、必ず医師と相談してください。自己判断での減薬は危険です。',
    likes: 156,
    retweets: 89,
    replies: 32,
  },
  {
    id: 4,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年3月4日',
    content:
      'ベンゾフォーラムで多くの質問にお答えしています。減薬に関する不安や疑問があれば、ぜひご相談ください。',
    images: [
      'https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg?auto=compress&cs=tinysrgb&w=300',
    ],
    likes: 203,
    retweets: 112,
    replies: 45,
  },
  {
    id: 5,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年3月3日',
    content:
      '最新の医学論文をまとめた資料を公開しました。医療従事者の方にも参考にしていただけます。',
    likes: 278,
    retweets: 156,
    replies: 67,
  },
  {
    id: 6,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年3月2日',
    content:
      '減薬中の症状について、多くの方から質問をいただいています。個人差があるため、焦らずに進めることが大切です。',
    likes: 189,
    retweets: 98,
    replies: 54,
  },
  {
    id: 7,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年3月1日',
    content:
      '書籍「ベンゾジアゼピン減薬ガイド」が多くの方に読まれています。ありがとうございます。',
    images: [
      'https://images.pexels.com/photos/196644/pexels-photo-196644.jpeg?auto=compress&cs=tinysrgb&w=300',
    ],
    likes: 312,
    retweets: 178,
    replies: 89,
  },
  {
    id: 8,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年2月28日',
    content:
      'ウェブサイトに新しい情報を追加しました。減薬スケジュールの例も掲載しています。',
    likes: 145,
    retweets: 67,
    replies: 23,
  },
  {
    id: 9,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年2月27日',
    content:
      '医療機関での相談の際に、こちらの資料を持参していただくとスムーズです。',
    likes: 198,
    retweets: 134,
    replies: 56,
  },
  {
    id: 10,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年2月26日',
    content:
      '減薬は長期戦です。1日1日を大切に、無理をせずに進めていきましょう。',
    likes: 267,
    retweets: 145,
    replies: 78,
  },
  {
    id: 11,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年2月25日',
    content:
      '海外の研究論文も随時紹介しています。国際的な視点からも情報を提供しています。',
    images: [
      'https://images.pexels.com/photos/414612/pexels-photo-414612.jpeg?auto=compress&cs=tinysrgb&w=300',
    ],
    likes: 223,
    retweets: 112,
    replies: 45,
  },
  {
    id: 12,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年2月24日',
    content:
      'フォーラムで経験を共有してくださる皆様、ありがとうございます。同じ悩みを持つ方の支えになっています。',
    likes: 178,
    retweets: 89,
    replies: 34,
  },
  {
    id: 13,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年2月23日',
    content:
      '減薬中の体調管理について、栄養面からのアプローチも重要です。',
    likes: 156,
    retweets: 78,
    replies: 29,
  },
  {
    id: 14,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年2月22日',
    content:
      '新しい書籍の執筆を進めています。より実践的な内容になる予定です。',
    likes: 289,
    retweets: 167,
    replies: 92,
  },
  {
    id: 15,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年2月21日',
    content:
      '医療従事者の方からの質問も増えています。正しい情報が広がることを願っています。',
    likes: 234,
    retweets: 123,
    replies: 67,
  },
  {
    id: 16,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年2月20日',
    content:
      '減薬のペースは人それぞれです。周りと比較せず、自分のペースで進めましょう。',
    images: [
      'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=300',
    ],
    likes: 312,
    retweets: 189,
    replies: 98,
  },
  {
    id: 17,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年2月19日',
    content:
      'ウェブサイトのアクセス数が増えています。より多くの方に情報が届くことを願っています。',
    likes: 201,
    retweets: 98,
    replies: 45,
  },
  {
    id: 18,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年2月18日',
    content:
      '減薬中の症状について、よくある質問をまとめました。参考にしてください。',
    likes: 267,
    retweets: 145,
    replies: 78,
  },
  {
    id: 19,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年2月17日',
    content:
      '海外の減薬支援団体との連携も進めています。国際的な情報交換が重要です。',
    likes: 189,
    retweets: 112,
    replies: 56,
  },
  {
    id: 20,
    user: {
      name: 'ベンゾジアゼピン情報センター【公式】',
      username: '@benzoinfojapan',
      avatar:
        'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    },
    timestamp: '2020年2月16日',
    content:
      '減薬を成功させた方の体験談を募集しています。同じ悩みを持つ方の励みになります。',
    images: [
      'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=300',
    ],
    likes: 345,
    retweets: 201,
    replies: 123,
  },
];

const liveEvents: LiveEvent[] = [
  {
    id: 1,
    user: 'まる',
    status: '（本人）',
    title: 'さづだーん笑お🎄11時終✓',
    participants: [
      'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=100',
      'https://images.pexels.com/photos/1288182/pexels-photo-1288182.jpeg?auto=compress&cs=tinysrgb&w=100',
    ],
    count: 14,
  },
  {
    id: 2,
    user: 'くてだまPfizer',
    status: '2🎓',
    title: 'スローぷ？レミーズ？な...',
    participants: [
      'https://images.pexels.com/photos/1520760/pexels-photo-1520760.jpeg?auto=compress&cs=tinysrgb&w=100',
      'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100',
    ],
    count: 11,
  },
];

const newsItems: NewsItem[] = [
  {
    id: 1,
    title: 'あしろう占いPCが...',
    status: 'さんがホストしています',
    verified: true,
  },
  {
    id: 2,
    title: '宣伝オリボス金闘スペース【引用リプOK】',
    status: 'さんがホストしています',
  },
];

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="max-w-[1280px] mx-auto flex w-full">
        <Sidebar />

        <main className="flex-1 md:max-w-[600px] min-w-0 h-screen overflow-y-auto">
          <ProfileHeader name="オーナー・アトム" postCount={7976} />
          
          <ProfileInfo
            bannerImage="https://images.pexels.com/photos/417074/pexels-photo-417074.jpeg?auto=compress&cs=tinysrgb&w=1200"
            avatar="https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=100"
            name="オーナー・アトム"
            username="@atomyah"
            verified={true}
            bio={`X（旧Twitter）のクローンSNS「Y」のオーナーです。業務効率化系生成AIアプリ開発、ベンゾジアゼピン問題の啓蒙、歌・ピアノいろいろやっています。`}
            website="https://my-portfolio-henna-sigma-88.vercel.app/"
            joinedDate="2018年4月"
            following={22000}
            followers={25000}
            isOwnProfile={false}
          />

          <ProfileTabs />
          <ProfileTimeline posts={mockPosts} />
        </main>

        <RightSidebar className="hidden lg:flex" liveEvents={liveEvents} newsItems={newsItems} />
      </div>
    </div>
  );
}

