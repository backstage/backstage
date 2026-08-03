import{cf as h,cg as y,cj as T,ce as x,bu as S,bR as e,Q as _,a5 as V}from"./iframe-Bep9_wBM.js";import{M as j}from"./MenuBook-C-rC8OCw.js";import{S as u}from"./SearchType-DBVjhDBn.js";import{s as g,M as R}from"./api-DO95s3vP.js";import{S as q}from"./SearchContext-C1us4aI1.js";import{S as m}from"./Grid-CSg20Lpu.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-81E6Sqib.js";import"./useAsync-CsrOrKoz.js";import"./useMountedState-CkGlRQBd.js";import"./translation-BZMRjflS.js";import"./Box-CFxjkepC.js";import"./styled-BV5dnJ-_.js";import"./AccordionDetails-DZeyCTvf.js";import"./index-B9sM2jn7.js";import"./Collapse-Ddu_bpDm.js";import"./List-BDBMMAfU.js";import"./ListContext-B8pcQC18.js";import"./Divider-CvC6qSqk.js";import"./ListItem-BMjBWple.js";import"./ListItemIcon-DAE2EAzV.js";import"./ListItemText-CR9yFiV6.js";import"./makeStyles-n7QD1cTQ.js";import"./Tabs-BD9KhIX_.js";import"./KeyboardArrowRight-G7QR3ZdS.js";import"./FormLabel-DR0V8nP4.js";import"./formControlState-D8h39eZq.js";import"./InputLabel-QqFJ580j.js";import"./Select-Ch0J349h.js";import"./Popover-BdF5uGXc.js";import"./Modal-sY10qo8j.js";import"./Portal-Crf4b_8F.js";import"./MenuItem-o2qTtM-r.js";import"./Checkbox-D5q-gwsx.js";import"./SwitchBase-Ded9Cwc4.js";import"./Chip-C6RVIi6j.js";import"./useAnalytics-BQV4eG0U.js";import"./lodash-DlmSvGPN.js";var a={},d;function D(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var I=D();const P=S(I);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var b=M();const A=S(b),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new R]],children:e.jsx(q,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(A,{})},{value:"value-3",name:"Value Three",icon:e.jsx(P,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
