import PageNav from '../components/PageNav';

import styles from './Product.module.css';

export default function Product() {
    return (
        <main className={styles.product}>
            <PageNav />
            <section>
                <img
                    src="img-1.jpg"
                    alt="person with dog overlooking mountain with sunset"
                />
                <div>
                    <h2>About WorldWide.</h2>
                    <p>
                        We have a vast network of trip leaders, subject-matter
                        experts, community insiders, experience hosts, writers,
                        editors, video and podcast producers, and of course
                        travelers.
                    </p>
                    <p>
                        All of them are integral to our work of uncovering the
                        world’s hidden wonders and making it possible for the
                        rest of the community to experience them—whether that’s
                        reading about them in the WorldWide, visiting on one’s
                        own, or joining one of our groups on an WorldWide
                        adventure.
                    </p>
                </div>
            </section>
        </main>
    );
}
