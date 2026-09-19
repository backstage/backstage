import{aW as h,aX as y,aY as T,aZ as x,aN as S,j as e,P as _,a3 as V}from"./iframe-CxlUpTpq.js";import{M as j}from"./MenuBook-DrFqf8bq.js";import{S as u}from"./SearchType-D3iquLYK.js";import{s as g,M as P}from"./api-BjL1FgrG.js";import{S as R}from"./SearchContext-CDV3EPdy.js";import{S as m}from"./Grid-BLfllSxx.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-JdlG67sm.js";import"./useAsync-mJPdi9qv.js";import"./useMountedState-DkDBMh4e.js";import"./translation-C8-AQg9Q.js";import"./Box-BmCEZaGT.js";import"./styled-ri-sX4kt.js";import"./AccordionDetails-DoQbYKV5.js";import"./index-B9sM2jn7.js";import"./Collapse-CV0Gnfx7.js";import"./List-DdEJ-kwg.js";import"./ListContext-T4foTbcb.js";import"./Divider-Bkd74j0H.js";import"./ListItem-CFzuWqPn.js";import"./ListItemIcon-CHUdDd5R.js";import"./ListItemText-DTWT_exv.js";import"./makeStyles-DbA2ZWGd.js";import"./Tabs-DalA-94r.js";import"./KeyboardArrowRight-BBZURrQp.js";import"./FormLabel-CR4AfPre.js";import"./formControlState-CaIJfm6V.js";import"./InputLabel-BLUb4tnT.js";import"./Select-yaFOL800.js";import"./Popover-BYsAO0mz.js";import"./Modal-quoFuAtb.js";import"./Portal-DIfaqq2w.js";import"./MenuItem-Dlxl8Kf2.js";import"./Checkbox-P32LcVqe.js";import"./SwitchBase-CpJ5beLo.js";import"./Chip-MdGCCcW4.js";import"./useAnalytics-CsE2FyHM.js";import"./lodash-7klT_A_g.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=S(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(T()),l=r(x()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const b=S(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[g,new P]],children:e.jsx(R,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(b,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
