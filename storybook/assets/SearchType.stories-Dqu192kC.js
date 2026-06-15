import{cf as h,cg as y,cj as T,ce as x,bu as S,bR as e,Q as _,a5 as V}from"./iframe-CNmrqhdp.js";import{M as j}from"./MenuBook-BBS3qzZ8.js";import{S as u}from"./SearchType-D5YOnCif.js";import{s as g,M as R}from"./api-CoPVOKZF.js";import{S as q}from"./SearchContext-6AdMozhh.js";import{S as m}from"./Grid-BGPHOMQP.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-C1SJEl53.js";import"./useAsync-AVyJcLhD.js";import"./useMountedState-CokGl4ZB.js";import"./translation-CXzDU3zg.js";import"./Box-1MBd1NdD.js";import"./styled-wlFTiasm.js";import"./AccordionDetails-C0yuhCvO.js";import"./index-B9sM2jn7.js";import"./Collapse-DkReGfOr.js";import"./List-ahum0BRu.js";import"./ListContext-B5UlMvnw.js";import"./Divider-DvCVn6dj.js";import"./ListItem-B6bQ60ol.js";import"./ListItemIcon-PtywKY5-.js";import"./ListItemText-BeWx-Vvf.js";import"./makeStyles-CoULisOM.js";import"./Tabs-DqJgtTEt.js";import"./KeyboardArrowRight-BVtX_x0F.js";import"./FormLabel-CReW77_N.js";import"./formControlState-DzzoqcVY.js";import"./InputLabel-CrwwtwJP.js";import"./Select-BRs4pJN5.js";import"./Popover-DXsb97Zc.js";import"./Modal-Bj4IWEm7.js";import"./Portal-BeWhklMr.js";import"./MenuItem-DpDyyn3a.js";import"./Checkbox-nQOx_B4l.js";import"./SwitchBase-UYIg4lyI.js";import"./Chip-Cs6bdejH.js";import"./useAnalytics-BfmOd9pS.js";import"./lodash-DcRUHytK.js";var a={},d;function D(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var I=D();const P=S(I);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var b=M();const A=S(b),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new R]],children:e.jsx(q,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(A,{})},{value:"value-3",name:"Value Three",icon:e.jsx(P,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>;
}`,...t.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  return <SearchType.Accordion name="Result Types" defaultValue="value-1" types={[{
    value: 'value-1',
    name: 'Value One',
    icon: <CatalogIcon />
  }, {
    value: 'value-2',
    name: 'Value Two',
    icon: <DocsIcon />
  }, {
    value: 'value-3',
    name: 'Value Three',
    icon: <UsersGroupsIcon />
  }]} />;
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  return <SearchType.Tabs defaultValue="value-1" types={[{
    value: 'value-1',
    name: 'Value One'
  }, {
    value: 'value-2',
    name: 'Value Two'
  }, {
    value: 'value-3',
    name: 'Value Three'
  }]} />;
}`,...s.parameters?.docs?.source}}};const Te=["Default","Accordion","Tabs"];export{i as Accordion,t as Default,s as Tabs,Te as __namedExportsOrder,ye as default};
