import{m as w,r as u,j as s,P as h,I as x}from"./iframe-B6vHPHUS.js";import{C as v,a as L}from"./ChevronRight-DXk07qO3.js";import{B as g}from"./Box-BsuLuKk6.js";import{S as j}from"./Grid-BHnfM9BN.js";import"./preload-helper-D9Z9MdNV.js";import"./styled-BNzka1pC.js";const $=e=>{const t=e==="dark"?"16%":"97%";return`
    hsl(0, 0%, ${t}) 0%,
    hsla(0, 0%, ${t}, 0.987) 8.1%,
    hsla(0, 0%, ${t}, 0.951) 15.5%,
    hsla(0, 0%, ${t}, 0.896) 22.5%,
    hsla(0, 0%, ${t}, 0.825) 29%,
    hsla(0, 0%, ${t}, 0.741) 35.3%,
    hsla(0, 0%, ${t}, 0.648) 41.2%,
    hsla(0, 0%, ${t}, 0.55) 47.1%,
    hsla(0, 0%, ${t}, 0.45) 52.9%,
    hsla(0, 0%, ${t}, 0.352) 58.8%,
    hsla(0, 0%, ${t}, 0.259) 64.7%,
    hsla(0, 0%, ${t}, 0.175) 71%,
    hsla(0, 0%, ${t}, 0.104) 77.5%,
    hsla(0, 0%, ${t}, 0.049) 84.5%,
    hsla(0, 0%, ${t}, 0.013) 91.9%,
    hsla(0, 0%, ${t}, 0) 100%
  `},k=100,S=10,z=w(e=>({root:{position:"relative",display:"flex",flexFlow:"row nowrap",alignItems:"center"},container:{overflow:"auto",scrollbarWidth:0,"&::-webkit-scrollbar":{display:"none"}},fade:{position:"absolute",width:k,height:`calc(100% + ${S}px)`,transition:"opacity 300ms",pointerEvents:"none"},fadeLeft:{left:-S,background:`linear-gradient(90deg, ${$(e.palette.type)})`},fadeRight:{right:-S,background:`linear-gradient(270deg, ${$(e.palette.type)})`},fadeHidden:{opacity:0},button:{position:"absolute"},buttonLeft:{left:-e.spacing(2)},buttonRight:{right:-e.spacing(2)}}),{name:"BackstageHorizontalScrollGrid"});function H(e){const[[t,i],n]=u.useState([0,0]);return u.useLayoutEffect(()=>{const r=e.current;if(!r){n([0,0]);return}const a=()=>{const o=r.scrollLeft,l=r.scrollWidth-r.offsetWidth-r.scrollLeft;n([o,l])};return a(),r.addEventListener("scroll",a),window.addEventListener("resize",a),()=>{r.removeEventListener("scroll",a),window.removeEventListener("resize",a)}},[e]),[t,i]}function C(e,t,i){const[n,r]=u.useState(0);return u.useLayoutEffect(()=>{if(n===0)return;const a=window.performance.now(),o=requestAnimationFrame(l=>{if(!e.current)return;const p=l-a,f=Math.abs(n)*p/t,c=Math.max(i,f)*Math.sign(n);e.current.scrollBy({left:c});const m=n-c;Math.sign(n)!==Math.sign(m)?r(0):r(m)});return()=>cancelAnimationFrame(o)},[e,n,t,i]),r}function y(e){const{scrollStep:t=100,scrollSpeed:i=50,minScrollDistance:n=5,children:r,...a}=e,o=z(e),l=u.useRef(),[p,f]=H(l),b=C(l,i,n),c=m=>{l.current&&b(m?t:-t)};return s.jsxs(g,{...a,className:o.root,children:[s.jsx(j,{container:!0,direction:"row",wrap:"nowrap",className:o.container,ref:l,children:r}),s.jsx(g,{className:h(o.fade,o.fadeLeft,{[o.fadeHidden]:p===0})}),s.jsx(g,{className:h(o.fade,o.fadeRight,{[o.fadeHidden]:f===0})}),p>0&&s.jsx(x,{title:"Scroll Left",onClick:()=>c(!1),className:h(o.button,o.buttonLeft,{}),children:s.jsx(v,{})}),f>0&&s.jsx(x,{title:"Scroll Right",onClick:()=>c(!0),className:h(o.button,o.buttonRight,{}),children:s.jsx(L,{})})]})}y.__docgenInfo={description:`Horizontal scrollable component with arrows to navigate

@public`,methods:[],displayName:"HorizontalScrollGrid",props:{scrollStep:{required:!1,tsType:{name:"number"},description:""},scrollSpeed:{required:!1,tsType:{name:"number"},description:""},minScrollDistance:{required:!1,tsType:{name:"number"},description:""}}};const E={height:0,padding:150,margin:20},R={width:800,height:400,margin:20},D=[.2,.3,.4,.5,.6,.7,.8,.9,1],M={title:"Layout/HorizontalScrollGrid",component:y},d=()=>s.jsx("div",{style:R,children:s.jsx(y,{children:D.map(e=>{const t={backgroundColor:`rgba(0, 185, 151, ${e})`};return s.jsx("div",{style:{...t,...E}},e)})})});d.__docgenInfo={description:"",methods:[],displayName:"Default"};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => <div style={containerStyle}>
    <HorizontalScrollGrid>
      {opacityArray.map(element => {
      const style = {
        backgroundColor: \`rgba(0, 185, 151, \${element})\`
      };
      return <div style={{
        ...style,
        ...cardContentStyle
      }} key={element} />;
    })}
    </HorizontalScrollGrid>
  </div>`,...d.parameters?.docs?.source}}};const q=["Default"];export{d as Default,q as __namedExportsOrder,M as default};
