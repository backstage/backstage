import{ca as c,bR as e,aa as u,u as D,l as g}from"./iframe-DogXi1kP.js";import{D as i}from"./Drawer-C3bNFiMH.js";import{B as t}from"./Button-BuZHMRa1.js";import{m as l}from"./makeStyles-Bkm64Dpi.js";import{c as p}from"./createStyles-Bp4GwXob.js";import"./preload-helper-PPVm8Dsz.js";import"./Modal-QwMqv6xi.js";import"./Portal-DKOM2ljc.js";import"./Backdrop-DXn5Ezuk.js";import"./createStyles-yD3y8ldD.js";const E={title:"Layout/Drawer",component:i,tags:["!manifest"]},d=l(s=>p({paper:{width:"50%",justifyContent:"space-between",padding:s.spacing(2.5)}})),w=l(s=>p({header:{display:"flex",flexDirection:"row",justifyContent:"space-between"},icon:{fontSize:20},content:{height:"80%",backgroundColor:"#EEEEEE"},secondaryAction:{marginLeft:s.spacing(2.5)}})),m=({toggleDrawer:s})=>{const r=w();return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:r.header,children:[e.jsx(u,{variant:"h5",children:"Side Panel Title"}),e.jsx(D,{title:"Close the drawer",onClick:()=>s(!1),color:"inherit",children:e.jsx(g,{className:r.icon})},"dismiss")]}),e.jsx("div",{className:r.content}),e.jsxs("div",{children:[e.jsx(t,{variant:"contained",color:"primary",onClick:()=>s(!1),children:"Primary Action"}),e.jsx(t,{className:r.secondaryAction,variant:"outlined",color:"primary",onClick:()=>s(!1),children:"Secondary Action"})]})]})},a=()=>{const[s,r]=c.useState(!1),o=d();return e.jsxs(e.Fragment,{children:[e.jsx(t,{variant:"contained",color:"primary",onClick:()=>r(!0),children:"Open Default Drawer"}),e.jsx(i,{classes:{paper:o.paper},anchor:"right",open:s,onClose:()=>r(!1),children:e.jsx(m,{toggleDrawer:r})})]})},n=()=>{const[s,r]=c.useState(!1),o=d();return e.jsxs(e.Fragment,{children:[e.jsx(t,{variant:"contained",color:"primary",onClick:()=>r(!0),children:"Open Persistent Drawer"}),e.jsx(i,{classes:{paper:o.paper},variant:"persistent",anchor:"right",open:s,onClose:()=>r(!1),children:e.jsx(m,{toggleDrawer:r})})]})};a.__docgenInfo={description:"",methods:[],displayName:"DefaultDrawer"};n.__docgenInfo={description:"",methods:[],displayName:"PersistentDrawer"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  const [isOpen, toggleDrawer] = useState(false);
  const classes = useDrawerStyles();
  return <>
      <Button variant="contained" color="primary" onClick={() => toggleDrawer(true)}>
        Open Default Drawer
      </Button>
      <Drawer classes={{
      paper: classes.paper
    }} anchor="right" open={isOpen} onClose={() => toggleDrawer(false)}>
        <DrawerContent toggleDrawer={toggleDrawer} />
      </Drawer>
    </>;
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  const [isOpen, toggleDrawer] = useState(false);
  const classes = useDrawerStyles();
  return <>
      <Button variant="contained" color="primary" onClick={() => toggleDrawer(true)}>
        Open Persistent Drawer
      </Button>
      <Drawer classes={{
      paper: classes.paper
    }} variant="persistent" anchor="right" open={isOpen} onClose={() => toggleDrawer(false)}>
        <DrawerContent toggleDrawer={toggleDrawer} />
      </Drawer>
    </>;
}`,...n.parameters?.docs?.source}}};const B=["DefaultDrawer","PersistentDrawer"];export{a as DefaultDrawer,n as PersistentDrawer,B as __namedExportsOrder,E as default};
