import{j as e,K as l,d as c}from"./iframe-B4O_Vvag.js";import{T as p}from"./Tooltip-DIKSL5Jf.js";import{m as d}from"./makeStyles-cJwDV4Qm.js";import{S as u,U as g}from"./icons-C5t6fGD2.js";const m=d(()=>({icon:{color:"#f3ba37",cursor:"pointer",display:"inline-flex"},iconBorder:{color:"inherit",cursor:"pointer",display:"inline-flex"}}),{name:"BackstageFavoriteToggleIcon"});function t(i){const{isFavorite:n}=i,o=m();return e.jsx(c,{component:"span",className:n?o.icon:o.iconBorder,children:n?e.jsx(u,{}):e.jsx(g,{})})}function T(i){const{id:n,title:o,isFavorite:r,onToggle:a,...s}=i;return e.jsx(p,{id:n,title:o,children:e.jsx(l,{"aria-label":o,id:n,onClick:()=>a(!r),color:"inherit",...s,children:e.jsx(t,{isFavorite:r})})})}t.__docgenInfo={description:`Icon used in FavoriteToggle component.

Can be used independently, useful when used as {@link @material-table/core#MaterialTableProps.actions} in {@link @material-table/core#MaterialTable}

@public`,methods:[],displayName:"FavoriteToggleIcon",props:{isFavorite:{required:!0,tsType:{name:"boolean"},description:""}}};T.__docgenInfo={description:`Toggle encapsulating logic for marking something as favorite,
primarily used in various instances of entity lists and cards but can be used elsewhere.

This component can only be used in as a controlled toggle and does not keep internal state.

@public`,methods:[],displayName:"FavoriteToggle",props:{id:{required:!0,tsType:{name:"string"},description:""},title:{required:!0,tsType:{name:"string"},description:""},isFavorite:{required:!0,tsType:{name:"boolean"},description:""},onToggle:{required:!0,tsType:{name:"signature",type:"function",raw:"(value: boolean) => void",signature:{arguments:[{type:{name:"boolean"},name:"value"}],return:{name:"void"}}},description:""}}};export{T as F};
