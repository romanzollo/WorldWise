import PageNav from '../components/PageNav';

import styles from './Product.module.css';

export default function Product() {
    return (
        <main className={styles.product}>
            <PageNav />

            <section>
                <div>
                    <h2>
                        Simple pricing.
                        <br />
                        Just $9/month.
                    </h2>
                    <p>
                        Discover hidden wonders where you least expect them. We
                        seek out the most incredible places that others
                        overlook.
                    </p>
                </div>
                <img
                    src="img-2.jpg"
                    alt="overview of a large city with skyscrapers"
                />
            </section>
        </main>
    );
}
