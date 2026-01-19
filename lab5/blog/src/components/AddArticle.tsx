import type ArticleData from './ArticleData.ts';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import styles from './AddArticle.module.css';

function AddArticle() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const navigate = useNavigate();

    function addArticle() {
        const currentData: ArticleData[] = JSON.parse(localStorage.getItem('articles') ?? '[]');


        const id = (currentData.map(x => x.id).sort()[0] ?? 0) + 1;

        localStorage.setItem('articles', JSON.stringify([...currentData, {id, title, content}]));

        navigate('../blog');
    }

    function isDisabled() {
        return title.length < 3 || content.length < 20;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Create New Article</h1>
            <form className={styles.form}>
                <section className={styles.section}>
                    <label className={styles.label}>
                        Title
                    </label>
                    <input
                        className={styles.input}
                        type={'text'}
                        placeholder="Enter article title..."
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <div className={styles.info}>Minimum 3 characters</div>
                    {title.length < 3 && title.length > 0 && (
                        <div className={styles.validation}>
                            <span className={styles.validationIcon}>✗</span>
                            Title too short ({title.length}/3)
                        </div>
                    )}
                    {title.length >= 3 && (
                        <div className={styles.validation} style={{color: '#4ade80'}}>
                            <span className={styles.validationIcon}>✓</span>
                            Title is valid
                        </div>
                    )}
                </section>
                <section className={styles.section}>
                    <label className={styles.label}>
                        Content
                    </label>
                    <textarea
                        className={styles.textarea}
                        placeholder="Enter article content..."
                        value={content}
                        onChange={e => setContent(e.target.value)}
                    />
                    <div className={styles.info}>Minimum 20 characters</div>
                    {content.length < 20 && content.length > 0 && (
                        <div className={styles.validation}>
                            <span className={styles.validationIcon}>✗</span>
                            Content too short ({content.length}/20)
                        </div>
                    )}
                    {content.length >= 20 && (
                        <div className={styles.validation} style={{color: '#4ade80'}}>
                            <span className={styles.validationIcon}>✓</span>
                            Content is valid
                        </div>
                    )}
                </section>
                <div className={styles.buttonContainer}>
                    <button
                        className={styles.submitButton}
                        disabled={isDisabled()}
                        onClick={addArticle}
                        type="button"
                    >
                        Add article
                    </button>
                    <button
                        className={styles.cancelButton}
                        type="button"
                        onClick={() => navigate('../blog')}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddArticle;