import React from 'react'

const TrustBadges = () => {
  return (
    <section className="border-t border-border-subtle bg-bg-primary py-12">
        <div className="w-full max-w-360 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><rect x="1" y="3" width="15" height="13" rx="2" /><path d="M16 8h5l3 5v3h-8V8z" /><circle cx="5.5" cy="18.5" r="2.5" /><circle cx="18.5" cy="18.5" r="2.5" /></svg>, title: 'Fast Delivery',     subtitle: 'Same-day in Lagos' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,                                                                                                                                                                                                              title: 'Buyer Protection', subtitle: '100% secure checkout' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" /></svg>,                                                                                                                                                                                    title: 'Easy Returns',     subtitle: '30-day return policy' },
              { icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>,                                                                                                                                                                                      title: 'Verified Vendors',  subtitle: 'All sellers are vetted' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center gap-3">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-accent-gold-muted text-accent-gold">{item.icon}</div>
                <div>
                  <p className="font-semibold text-sm text-text-primary">{item.title}</p>
                  <p className="text-xs text-text-muted mt-0.5">{item.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
  )
}

export default TrustBadges
