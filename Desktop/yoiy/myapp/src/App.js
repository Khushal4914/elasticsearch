import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios' ;
import  './infinite.css';
function App() {
  const InfiniteScrollComponent = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const loader = useRef(null);

    useEffect(() => { 
      const observer = new IntersectionObserver(handleObserver);
      if (loader.current) {
        observer.observe(loader.current);
      }
      return () => {
        if (loader.current) {
          observer.unobserve(loader.current);
        }
      };
    }, []);

    const handleObserver = (entities) => {
      const target = entities[0];
      if (target.isIntersecting && hasMore) {
        fetchData();
      }
    };

    const fetchData = async () => {
      const token = 'eyJhbGciOiJIUzUxMiJ9.eyJmaXJzdE5hbWUiOiJhdmlyYWwiLCJsYXN0TmFtZSI6ImxhbWJhIiwic3ViIjoiYXZpcmFsQGdlbmllbW9kZS5jb20iLCJyb2xlcyI6WyJybSIsIkdlbmllbW9kZSBNZXJjaGFuZGlzZXIgUm9sZSIsIkdlbmllbW9kZSIsIkJ1eWVyIiwiYWRtaW4iLCJQb3J0YWwgQWRtaW4gUm9sZSIsImxlYWRfaGVhZCIsInN1cGVyX21hbmFnZXIiLCJmaW50ZWNoX2ZhY3RvcnkiLCJwcm9kdWN0X2FkbWluIiwiZnVsZmlsbG1lbnQiLCJybSIsIlVzZXIgQWRtaW4gUm9sZSIsInFjX21hbmFnZXIiLCJmaW5hbmNlIiwic3RvcmVfbWFuYWdlciIsImRlc2lnbmVyIiwibG9naXN0aWNzX21hbmFnZXIiLCJmYWJyaWNfcm0iLCJnYXRlX291dCIsImdhdGVfaW4iLCJxY192cCIsInZwIl0sImFjdGl2ZSI6dHJ1ZSwiZ3JvdXBzIjpbIkdlbmllbW9kZSBNZXJjaGFuZGlzZXJzIl0sImlkIjoxMTkxLCJleHAiOjE3MTA1NzUwNzMsImlhdCI6MTcwNzk4MzA3MywidXNlcklkIjoxMTkxLCJ1c2VybmFtZSI6ImF2aXJhbEBnZW5pZW1vZGUuY29tIn0.Yf66GcClWvYiSptPCAjf2x_D9q_X_9tKEzP9EIV0-piq4NTnbM0JyF4pioUmu4DajPN-QKhGMiSM-n7aK4nBTA';
      const url = `https://cataloguing-dev.geniemode.com/api/v1/skus/elastic-search?aggregation_size=1000&page=${1}&size=8&skip_image_check=true&showhidden=true&skip_status_check=true&sort=created_at,DESC&sold=true&is_design_by_geniemode=false&show_tagged_products_only=false`;

      try {
        setLoading(true);
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        });

        const responseData = await response.json();

        if (Array.isArray(responseData.content)) {
          setData(prevData => [...prevData, ...responseData.content]);
          setPage(prevPage => prevPage + 1);
          setHasMore(responseData.content.length > 0);
        } else {
          console.error('Response data content is not an array:', responseData.content);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div>
        <h1>Items</h1>
        <div>
          {data.map(item => (
           <div className= 'imagess'>
                {item.images && item.images.length > 0 ? (
                  item.images.map(image => (
                    <img key={image.id} src={image.url} alt={`Image ${image.id}`} />
                  ))
                ) : (
                  <p>No images available</p>
                )}
              </div>
           
          ))}
        </div>
        <div ref={loader} style={{ textAlign: 'center', color: 'black'}}>
          {loading && <p>Loading...</p>}
          {!loading && !hasMore && <p>No more items to load</p>}
        </div>
      </div>
    );
  };

  return <InfiniteScrollComponent />;
}

export default App;