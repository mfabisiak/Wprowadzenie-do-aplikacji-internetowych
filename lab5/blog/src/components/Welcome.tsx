import {Link} from 'react-router-dom';
import styles from './Welcome.module.css';

function Welcome() {
    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <h1 className={styles.title}>Welcome to my blog!</h1>
                <Link to={'/blog'} className={styles.buttonLink}>
                    <button className={styles.button}>Explore Articles →</button>
                </Link>
            </div>
        </div>
    );
}

export default Welcome;