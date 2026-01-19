import {Link} from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    Blog
                </Link>
                <ul className={styles.navLinks}>
                    <li>
                        <Link
                            to="/"
                            className={styles.navLink}
                        >
                            Home
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/blog"
                            className={styles.navLink}
                        >
                            Articles
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;

