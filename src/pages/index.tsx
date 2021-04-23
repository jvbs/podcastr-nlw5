import { GetStaticProps } from "next"

//? interface works the same aswell

type Episode = {
  id: string;
  title: string;
  members: string;
}

type HomeProps = {
  episodes: Episode[];
}

/*
type HomeProps = {
  episodes: Array<{
    id: string;
    title: string;
    members: string;
  }>
}
*/

export default function Home(props : HomeProps) {
  return <p>{JSON.stringify(props.episodes)}</p>
}

export const getStaticProps : GetStaticProps = async () => {
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return {
    props: {
      episodes: data,
    },
    revalidate: 60 * 60 * 8 // 
  }
}