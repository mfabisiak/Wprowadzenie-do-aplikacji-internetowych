import styles from './Blog.module.css';

import {Link} from 'react-router-dom';
import type ArticleData from './ArticleData.ts';

function Blog() {
    const articles: ArticleData[] = JSON.parse(localStorage.getItem('articles') ?? '[]');

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Number of articles: {articles.length}</h1>
            <div className={styles.articlesContainer}>
                {articles.map(article =>
                    <div key={article.id} className={styles.article}>
                        <Link to={`../article/${article.id}`}><h2>{article.title}</h2></Link>
                        <p>{article.content}</p>
                    </div>
                )}
            </div>
            <div className={styles.buttonContainer}>
                <Link to={'../add'}>
                    <button className={styles.addButton}>Add new article</button>
                </Link>
            </div>
        </div>
    );
}

export default Blog;