import{aP as h,aQ as y,aR as S,aS as T,aE as x,j as e,P as _,a2 as V}from"./iframe-izSSIzTR.js";import{M as j}from"./MenuBook-DDZQ7_1W.js";import{S as u}from"./SearchType-Du9OudSG.js";import{s as P,M as R}from"./api-DXAPgYrO.js";import{S as g}from"./SearchContext-CVQkOSvw.js";import{S as m}from"./Grid-DS_Ye4hI.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-Cro6Rs4P.js";import"./useAsync-fAA18DwO.js";import"./useMountedState-BNHFfL0T.js";import"./translation-BdvHgyF2.js";import"./Box-BA3YWuLj.js";import"./styled-DV0BGOgt.js";import"./AccordionDetails-B2SuDynl.js";import"./index-B9sM2jn7.js";import"./Collapse-61rLnbUv.js";import"./List-Bk9wyVdJ.js";import"./ListContext-CKBIT16f.js";import"./Divider-CT2SL79S.js";import"./ListItem-CLO1ybEL.js";import"./ListItemIcon-D16MAJMA.js";import"./ListItemText-BVZ15Dno.js";import"./makeStyles-efJG6AvH.js";import"./Tabs-Dj4mJm0m.js";import"./KeyboardArrowRight-BZf9R7GN.js";import"./FormLabel-A-dydj7E.js";import"./formControlState-rlZ1bOrQ.js";import"./InputLabel-D50nqvI_.js";import"./Select-BsMdqjz8.js";import"./Popover-DdhQCyLQ.js";import"./Modal-BbQmRZa1.js";import"./Portal-gwFfNa32.js";import"./MenuItem-CgKnBAX1.js";import"./Checkbox-CjRWyPfo.js";import"./SwitchBase-DnSy52Dc.js";import"./Chip-DD9LLMzJ.js";import"./useAnalytics-DIHZCFHN.js";import"./lodash-BqgGC0cZ.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=y();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(S()),l=r(T()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=x(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=y();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(S()),l=r(T()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const E=x(A),ye={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[P,new R]],children:e.jsx(g,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(E,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const Se=["Default","Accordion","Tabs"];export{i as Accordion,t as Default,s as Tabs,Se as __namedExportsOrder,ye as default};
