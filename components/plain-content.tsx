export function PlainContent({value}:{value:string|null|undefined}){if(!value)return null;return <>{value.split(/\n{2,}/).map((block,index)=><p key={index}>{block}</p>)}</>;}
