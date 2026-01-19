import {Link} from 'react-router-dom';

function Welcome() {
    return (
        <>
            <h1>Welcome to my blog!</h1>
            <Link to={'/blog'}>See all articles</Link>
        </>
    );
}

export default Welcome;