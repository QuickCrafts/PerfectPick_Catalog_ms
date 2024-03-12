# Catalog Microservice

Generation and management of catalog of movies, books and songs.

---
<br />

## API Reference

### Movies

#### Create movie

Create new movie. Returns movie id generated.

```http
  POST /movies
```

```typescript
// Body interface
interface Create_Movie{
  title?: string
  original_title: string 
  genre: string
  duration?: string
  director?: string
  release_date?: date
  cast?: string[]
  writers?: string[]
  seasons?: number
  episodes?: number
  awards?: string
  rating?: decimal
  // any other movie/series important attribute
}
```

| Response Status | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `201` | `success` | Returns movie id|
| `400` | `error` | "Guard failed" |
| `500` | `error` | Any other error message|

```typescript
// Response interface
interface Create_Movie_Response{
  id: number // Movie id
}
```

#### Delete movie

Delete all movie information.

```http
  DELETE /movies/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | **Required**. movie id |

| Response Status | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `204` | `success` |No content|
| `404` | `error` | "movie not found"|
| `400` | `error` | "Id not provided" |
| `500` | `error` | Any other error message|

#### Update movie

Update movie.

```http
  PUT /movies/${id}
```

```typescript
// Body interface
interface Update_Movie{
  title?: string
  original_title?: string 
  genre?: string
  duration?: string
  director?: string
  release_date?: string
  cast?: string[]
  writers?: string[]
  seasons?: number
  episodes?: number
  awards?: number
  rating?: number
  // any other movie/series important attribute
}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | **Required**. movie id |


| Response Status | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `201` | `success` | "Movie updated"|
| `400` | `error` | "Guard failed" |
| `400` | `error` | "Id not provided" |
| `404` | `error` | "Movie not found" |
| `500` | `error` | Any other error message|

#### Get movie

Get movie.

```http
  GET /movies/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | **Required**. movie id |


| Response Status | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `200` | `success` | Return Movie JSON|
| `400` | `error` | "Guard failed" |
| `404` | `error` | "Movie not found" |
| `500` | `error` | Any other error message|

```typescript
// Response interface
interface Response_Get_Movie{
  id: number
  info: Document // JSON with all the info
}
```

#### Get movies

Get movies.

```http
  GET /movies
```


| Response Status | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `200` | `success` | Return Movies JSONs|
| `500` | `error` | Any other error message|

```typescript
interface Movie{
  id: number
  info: Document // JSON with all the info
}

// Response interface
interface Response_Get_Movies{
  movies: Movie[]
}
```

#### Initialization and update of movies

Get movies information from [OMDB API](https://www.omdbapi.com) to init PerfectPick movies database or to update with new missing movies.

```http
  PUT /movies/init
```

| Response Status | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `201` | `success` | "Movies updated."|
| `500` | `error` | Any other error message|


### Books

#### Create book

Create new book. Returns book id generated.

```http
  POST /books
```

```typescript
// Body interface
interface Create_Book{
  title: string
  author: string
  genre: string
  pages?: number
  year?: number
  rating?: decimal
  // any other book important attribute
}
```

| Response Status | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `201` | `success` | Returns book id|
| `400` | `error` | "Guard failed" |
| `500` | `error` | Any other error message|

```typescript
// Response interface
interface Create_Book_Response{
  id: number // book id
}
```

#### Delete book

Delete all book information.

```http
  DELETE /books/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | **Required**. book id |

| Response Status | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `204` | `success` |No content|
| `404` | `error` | "Book not found"|
| `400` | `error` | "Id not provided" |
| `500` | `error` | Any other error message|

#### Update book

Update book.

```http
  PUT /books/${id}
```

```typescript
// Body interface
interface Update_book{
  title?: string
  author?: string
  genre?: string
  pages?: number
  year?: string
  rating?: number
  // any other book important attribute
}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | **Required**. book id |


| Response Status | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `201` | `success` | "Book updated"|
| `400` | `error` | "Guard failed" |
| `400` | `error` | "Id not provided" |
| `404` | `error` | "Book not found" |
| `500` | `error` | Any other error message|

#### Get book

Get book.

```http
  GET /books/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | **Required**. book id |


| Response Status | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `200` | `success` | Return book JSON|
| `400` | `error` | "Guard failed" |
| `404` | `error` | "Book not found" |
| `500` | `error` | Any other error message|

```typescript
// Response interface
interface Response_Get_Book{
  id: number
  info: Document // JSON with all the info
}
```

#### Get books

Get books.

```http
  GET /books
```


| Response Status | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `200` | `success` | Return books JSONs|
| `500` | `error` | Any other error message|

```typescript
interface book{
  id: number
  info: Document // JSON with all the info
}

// Response interface
interface Response_Get_Books{
  books: book[]
}
```

#### Initialization and update of books

Get books information from [Google Libros API](https://developers.google.com/books/docs/v1/using) to init PerfectPick books database or to update with new missing books.

```http
  PUT /books/init
```

| Response Status | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `201` | `success` | "Books updated."|
| `500` | `error` | Any other error message|

### Music

#### Create song

Create new song. Returns song id generated.

```http
  POST /songs
```

```typescript
// Body interface
interface Create_Song{
  title: string
  artist: string
  genre: string
  album?: string
  year?: number
  duration?: number
  // any other song important attribute
}
```

| Response Status | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `201` | `success` | Returns song id|
| `400` | `error` | "Guard failed" |
| `500` | `error` | Any other error message|

```typescript
// Response interface
interface Create_Song_Response{
  id: number // song id
}
```

#### Delete song

Delete all song information.

```http
  DELETE /songs/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | **Required**. song id |

| Response Status | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `204` | `success` |No content|
| `404` | `error` | "Song not found"|
| `400` | `error` | "Id not provided" |
| `500` | `error` | Any other error message|

#### Update song

Update song.

```http
  PUT /songs/${id}
```

```typescript
// Body interface
interface Create_Song{
  title?: string
  artist?: string
  genre?: string
  album?: number
  year?: string
  duration?: number
  // any other song important attribute
}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | **Required**. song id |


| Response Status | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `201` | `success` | "Song updated"|
| `400` | `error` | "Guard failed" |
| `400` | `error` | "Id not provided" |
| `404` | `error` | "Song not found" |
| `500` | `error` | Any other error message|

#### Get song

Get song.

```http
  GET /songs/${id}
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `id` | `int` | **Required**. Song id |


| Response Status | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `200` | `success` | Return song JSON|
| `400` | `error` | "Guard failed" |
| `404` | `error` | "Song not found" |
| `500` | `error` | Any other error message|

```typescript
// Response interface
interface Response_Get_Song{
  id: number
  info: Document // JSON with all the info
}
```

#### Get songs

Get songs.

```http
  GET /songs
```


| Response Status | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `200` | `success` | Return songs JSONs|
| `500` | `error` | Any other error message|

```typescript
interface Song{
  id: number
  info: Document // JSON with all the info
}

// Response interface
interface Response_Get_Songs{
  songs: Song[]
}
```

#### Initialization and update of songs

Get songs information from [Spotify API](https://developer.spotify.com/documentation/web-api) to init PerfectPick songs database or to update with new missing songs.

```http
  PUT /songs/init
```

| Response Status | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `201` | `success` | "Songs updated."|
| `500` | `error` | Any other error message|

---
<br />
<br />
<br />


## Deployment

To deploy this project run

[//]: <> (@todo correct)

```bash
  npm run deploy
```

## Run Locally

Clone the project

```bash
  git clone https://github.com/QuickCrafts/PerfectPick_Catalog_ms.git
```

Go to the project directory

```bash
  cd PerfectPick_Catalog_ms
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```