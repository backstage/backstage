import{j as p}from"./jsx-runtime-hv06LKfz.js";import{r as d}from"./index-D8-PC79C.js";import{P as n}from"./index-BKN9BsH4.js";import{b as c}from"./ApiRef-ByCJBjX1.js";import{a as u}from"./ConfigApi-ij0WO1-Y.js";class m{holders;constructor(...e){this.holders=e}get(e){for(const t of this.holders){const r=t.get(e);if(r)return r}}}const i=c("api-context"),s=o=>{const{apis:e,children:t}=o,r=d.useContext(i)?.atVersion(1),a=r?new m(e,r):e;return p.jsx(i.Provider,{value:u({1:a}),children:t})};s.propTypes={apis:n.shape({get:n.func.isRequired}).isRequired,children:n.node};s.__docgenInfo={description:`Provides an {@link @backstage/core-plugin-api#ApiHolder} for consumption in
the React tree.

@public`,methods:[],displayName:"ApiProvider",props:{apis:{required:!0,tsType:{name:"signature",type:"object",raw:`{
  get<T>(api: ApiRef<T>): T | undefined;
}`,signature:{properties:[{key:"get",value:{name:"union",raw:"T | undefined",elements:[{name:"T"},{name:"undefined"}],required:!0}}]}},description:"",type:{name:"shape",value:{get:{name:"func",required:!0}}}},children:{required:!1,tsType:{name:"ReactNode"},description:"",type:{name:"node"}}}};export{s as A};
