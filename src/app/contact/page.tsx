// 問い合わせページ

import { Sidebar } from '@/components/home/sidebar';
import { ContactContent } from '@/components/contact/contact-content';

export default function ContactPage() {
  return (
    <div className="h-full min-h-0 bg-background overflow-x-hidden">
      <div className="max-w-[1280px] mx-auto flex w-full h-full min-h-0 overflow-y-auto">
        <Sidebar />

        <main className="flex-1 md:max-w-[800px] min-w-0 border-x border-border/40">
          <div className="sticky top-0 z-10 bg-background/90 backdrop-blur-sm px-5 py-4 border-b border-border/50">
            <h1 className="text-2xl font-bold">お問い合わせ</h1>
            <p className="text-sm text-muted-foreground mt-1">
              お問い合わせ内容をご記入のうえ、送信してください。担当者より折り返しご連絡いたします。
            </p>
          </div>

          <div className="p-5">
            <section className="rounded-2xl border border-border/50 bg-card p-4 md:p-5 shadow-sm">
              <ContactContent />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
