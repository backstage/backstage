import{cd as h,ce as y,ch as T,cc as x,bs as S,bQ as e,P as _,a4 as V}from"./iframe-Bkld27Xv.js";import{M as j}from"./MenuBook-CF1xZWHn.js";import{S as u}from"./SearchType-IOEz9MEG.js";import{s as g,M as P}from"./api-TH6zqA1p.js";import{S as R}from"./SearchContext-BMieN8V8.js";import{S as m}from"./Grid-NPf6_mtF.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-9E7NU3_r.js";import"./useAsync-Ciu42EII.js";import"./useMountedState-tSzLaBrI.js";import"./translation-BJTf41YG.js";import"./Box-U7ly1rzl.js";import"./styled-Ckr-4rIS.js";import"./AccordionDetails-CNTtopAw.js";import"./index-B9sM2jn7.js";import"./Collapse-Ly35HTAO.js";import"./List-B2gY9KR3.js";import"./ListContext-whwYHu0a.js";import"./Divider-Ct__Pu1F.js";import"./ListItem-Df-rkWNj.js";import"./ListItemIcon--JkZcCwf.js";import"./ListItemText-BqtvaA3J.js";import"./makeStyles-c8tM0-Si.js";import"./Tabs-D8vp8PNk.js";import"./KeyboardArrowRight-DHikn7YV.js";import"./FormLabel-C4WIXOsh.js";import"./formControlState-jQ21Kubq.js";import"./InputLabel-DMKXhnS7.js";import"./Select-Kkl0h5b4.js";import"./Popover-CElbwZXs.js";import"./Modal-BaL46tTG.js";import"./Portal-DZkIDTV8.js";import"./MenuItem-cky9qFyU.js";import"./Checkbox-CrDpW5Qu.js";import"./SwitchBase-B5i6PN3o.js";import"./Chip-Qlx9IIsZ.js";import"./useAnalytics-DgzNfNA8.js";import"./lodash-B0aJYi5c.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=S(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var b=M();const A=S(b),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new P]],children:e.jsx(R,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),s=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(A,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),i=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"Accordion"};i.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
  return <Paper style={{
    padding: 10
  }}>
      <SearchType name="Search type" values={values} defaultValue={values[0]} />
    </Paper>;
}`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};const Te=["Default","Accordion","Tabs"];export{s as Accordion,t as Default,i as Tabs,Te as __namedExportsOrder,ye as default};
