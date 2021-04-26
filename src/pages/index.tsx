//precisei instalar =>  npm install typescript @types/react @types/node -D
//tsx = typescript + jsx
//jsx = xml no javascript (é quando as tags do html estao no script)
//precisei instalar o Sass => npm install sass
//precisei instalar o json-server => npm install json-server
//precisei instalar o date-fns   https://date-fns.org/docs/Getting-Started   é pra lidar com datas no javascript=> npm install date-fns 
//precisei instalar o json-server = yarn jason-server    para simular uma api>>> ele pega um arquivo json e transforma numa api pra trabalhar enquanto estamos desenvolvendo o Frontend


//3 Formas de consumir uma API ...........=>a que me parece mais interessante é a SSG


/*
//SPA - single Page Application - Funciona em qualquer projeto React
import {useEffect} from "react"  //useEffect é um hook do React ... 

export default function Home() {
  useEffect(() => {
  fetch('http://localhost:3333/episodes')   //fetch é fazer uma chamada API
  .then(response=> response.json())         //pego a resposta dessa chamada e a converto em um arquivo json
  .then(data=> console.log(data))           //posso ver os dados solicitados no console
},[])

  return (
   <h1>Index</h1>
   
  )
}
*/


/*
//SSR - Server Side Rendering - Só funciona se for uma aplicacão em Next.js

export default function Home(props) {
  //console.log(props.episodes)     //como ele ta rodando na camada do Next.. ele nao vai aparecer no console.log do navegador.. mas aqui no terminal ele ta funcionando..
  //os dados dos episodios estao aqui no console do terminal.. para que apareca no navegador, vou colocalos num paragrafo.  <p>{JSON.stringify(props.episodes)}</p>| ele ficará exposto MESMO que o JS esteja desabilitado
  return (
    <div>
   <h1>Index</h1>        
   <p>{JSON.stringify(props.episodes)}</p> 
   </div>
  )
}

export async function getServerSideProps (){
  const response = await fetch('http://localhost:3333/episodes')  
  const data = await response.json()
  
  return {
    props: {
      episodes: data,   //o nome episodes, podia ser qualquer um... o data tem que ser o mesmo nome que vc deu no = await response.js().. 
    }
  }
}
*/

//SSG - Server Side Generation - Só funciona se for uma aplicacão em Next.js
import {GetStaticProps} from 'next';
import Image from 'next/image'
import { format, parseISO} from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { api } from '../services/api';
import { convertDurationToTimeString } from '../utils/CovertDurationToTimestring';
import styles from './home.module.scss';


type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  duration: string;
  durationAsString: string;
  url: string;
  publishedAt: string;
}

type  HomeProps = {
  latestEpisodes: Episode[];//outra forma de delcarar array no typescript => Array<Episodes>
  allEpisodes: Episode[];//outra forma de delcarar array no typescript => Array<Episodes>
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {
  return (
    <div className = {styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
          <ul>
            {latestEpisodes.map(episode=>{
              return (
                <li key={episode.id}>
                  <Image
                     width={192}
                     height={192}
                     src={episode.thumbnail}
                     alt={episode.title}
                     objectFit="cover"
                  />

                  <div className={styles.episodeDetails}>
                    <a href="">{episode.title}</a>
                    <p>{episode.members}</p>
                    <span>{episode.publishedAt}</span>
                    <span>{episode.durationAsString}</span>
                  </div>
                    <button type = 'button'>
                      <img src="/play-green.svg" alt="Tocar episódio"/>
                    </button>
                </li>  /*aula 3... parei em 38 minutos... o botao está ok*/
              )
            })}
          </ul>
      </section>
      <section className={styles.allEpisodes}>
            <h2>Todos episódios </h2>
            <table cellSpacing={0}>
              <thead>
                <th></th>
                <th>Podcast</th>
                <th>Integrantes</th>
                <th>Data</th>
                <th>Duração</th>
                <th></th>
              </thead>
              <tbody>
                {allEpisodes.map(episode =>{
                  return(
                    <tr key={episode.id}>
                      <td style={{ width:72}}>
                        <Image
                        width={120}
                        height={120}
                        src={episode.thumbnail}
                        alt={episode.title}
                        objectFit='cover'
                        />
                      </td>
                      <td>
                        <a href="">{episode.title}</a>
                      </td>
                      <td>{episode.members}</td>
                      <td style={{ width:100}}>{episode.publishedAt}</td>
                      <td>{episode.durationAsString}</td>
                      <td><button type='button'><img src="/play-green.svg" alt="Tocar Episódio"/></button></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
      </section>
   </div> 
  )
}

export  const getStaticProps:GetStaticProps = async () =>{
  const {data} = await api.get('episodes', {
    params:{
      _limit:12,
      _sort: 'publishe_at',
      _order: 'desc'
    }
  })  
  
  const episodes = data.map(episode=>{
    return{
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', {locale: ptBR}),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url,
    };

  })
  const latestEpisodes = episodes.slice(0,2); 
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
        props: {
          latestEpisodes,
          allEpisodes,
        },
        revalidate: 60 * 60 * 8,   //3 chamadas da API por dia   //o revalidate recebe um numero em segundos indicando o intervalo de tempo para gerar uma nova versao da pagina... em outras palavras solicitar os dado na API
      }   
}     
