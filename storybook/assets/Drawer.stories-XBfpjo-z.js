import{r as i,j as e,d as g,K as w,X as m}from"./iframe-CTfOr1ix.js";import{D as c}from"./Drawer-BOOaxJcU.js";import{m as l}from"./makeStyles-1FwyOuiP.js";import{B as t}from"./Button-CewwKG_B.js";import{c as p}from"./createStyles-Bp4GwXob.js";import"./preload-helper-PPVm8Dsz.js";import"./Modal-BiWFAeZ0.js";import"./Portal-6Q34r_Nq.js";import"./Backdrop-BN4cgqTA.js";import"./createStyles-yD3y8ldD.js";const B={title:"Layout/Drawer",component:c,tags:["!manifest"]},D=l(n=>p({paper:{width:"50%",justifyContent:"space-between",padding:n.spacing(2.5)}})),u=l(n=>p({header:{display:"flex",flexDirection:"row",justifyContent:"space-between"},icon:{fontSize:20},content:{height:"80%",backgroundColor:"#EEEEEE"},secondaryAction:{marginLeft:n.spacing(2.5)}})),d=({toggleDrawer:n})=>{const r=u();return e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:r.header,children:[e.jsx(g,{variant:"h5",children:"Side Panel Title"}),e.jsx(w,{title:"Close the drawer",onClick:()=>n(!1),color:"inherit",children:e.jsx(m,{className:r.icon})},"dismiss")]}),e.jsx("div",{className:r.content}),e.jsxs("div",{children:[e.jsx(t,{variant:"contained",color:"primary",onClick:()=>n(!1),children:"Primary Action"}),e.jsx(t,{className:r.secondaryAction,variant:"outlined",color:"primary",onClick:()=>n(!1),children:"Secondary Action"})]})]})},s=()=>{const[n,r]=i.useState(!1),o=D();return e.jsxs(e.Fragment,{children:[e.jsx(t,{variant:"contained",color:"primary",onClick:()=>r(!0),children:"Open Default Drawer"}),e.jsx(c,{classes:{paper:o.paper},anchor:"right",open:n,onClose:()=>r(!1),children:e.jsx(d,{toggleDrawer:r})})]})},a=()=>{const[n,r]=i.useState(!1),o=D();return e.jsxs(e.Fragment,{children:[e.jsx(t,{variant:"contained",color:"primary",onClick:()=>r(!0),children:"Open Persistent Drawer"}),e.jsx(c,{classes:{paper:o.paper},variant:"persistent",anchor:"right",open:n,onClose:()=>r(!1),children:e.jsx(d,{toggleDrawer:r})})]})};s.__docgenInfo={description:"",methods:[],displayName:"DefaultDrawer"};a.__docgenInfo={description:"",methods:[],displayName:"PersistentDrawer"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const DefaultDrawer = () => {
  const [isOpen, toggleDrawer] = useState(false);
  const classes = useDrawerStyles();

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => toggleDrawer(true)}
      >
        Open Default Drawer
      </Button>
      <Drawer
        classes={{
          paper: classes.paper,
        }}
        anchor="right"
        open={isOpen}
        onClose={() => toggleDrawer(false)}
      >
        <DrawerContent toggleDrawer={toggleDrawer} />
      </Drawer>
    </>
  );
};
`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const PersistentDrawer = () => {
  const [isOpen, toggleDrawer] = useState(false);
  const classes = useDrawerStyles();

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => toggleDrawer(true)}
      >
        Open Persistent Drawer
      </Button>
      <Drawer
        classes={{
          paper: classes.paper,
        }}
        variant="persistent"
        anchor="right"
        open={isOpen}
        onClose={() => toggleDrawer(false)}
      >
        <DrawerContent toggleDrawer={toggleDrawer} />
      </Drawer>
    </>
  );
};
`,...a.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
}`,...a.parameters?.docs?.source}}};const E=["DefaultDrawer","PersistentDrawer"];export{s as DefaultDrawer,a as PersistentDrawer,E as __namedExportsOrder,B as default};
