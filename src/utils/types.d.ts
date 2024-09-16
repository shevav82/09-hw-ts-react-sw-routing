export interface SWContextValue {
    changePage: (page: string) => void,
    page: string
}

export interface HeroInfo {
    name: string;
    gender: string;
    birth_year: string;
    height: string;      
    mass: string;        
    hair_color: string;
    skin_color: string;
    eye_color: string;
    
  }

export interface Character {
    id: string;
    name: string;
    img: string;
    url: string;
  }

export interface Item {
    title: string,
    path: string
}