import{aQ as h,aR as T,aS as y,aT as S,aE as x,j as e,P as _,a2 as V}from"./iframe-COJz9F1o.js";import{M as j}from"./MenuBook-hMnCOx6_.js";import{S as u}from"./SearchType-CFeS6FA3.js";import{s as R,M as g}from"./api-B1MnOkFf.js";import{S as P}from"./SearchContext-CURPT33y.js";import{S as m}from"./Grid-QH0IRglv.js";import"./preload-helper-PPVm8Dsz.js";import"./ExpandMore-DXunSdYg.js";import"./useAsync-BWf0vs4p.js";import"./useMountedState-C3abf_5z.js";import"./translation-Mzvdq05f.js";import"./Box-Dnr7lIgc.js";import"./styled-CHgYw-aN.js";import"./AccordionDetails-whFAo4IX.js";import"./index-B9sM2jn7.js";import"./Collapse-D_FlMLCQ.js";import"./List-DxjCJy_8.js";import"./ListContext-D1BzRUpQ.js";import"./Divider-zKAuOCNJ.js";import"./ListItem-BeM9N7OL.js";import"./ListItemIcon-1nMjLRo9.js";import"./ListItemText-BjqwjiRt.js";import"./makeStyles-DfpJxphG.js";import"./Tabs-BZ24p4cv.js";import"./KeyboardArrowRight-p9SKOiHY.js";import"./FormLabel-JqQMvLc0.js";import"./formControlState-WER4Vjx-.js";import"./InputLabel-BZLviDoN.js";import"./Select-Cl0mbIG0.js";import"./Popover-C_zNppFz.js";import"./Modal-C4q2dohw.js";import"./Portal-Df_bDRFp.js";import"./MenuItem-5VkYZ9CG.js";import"./Checkbox-GKSIBANN.js";import"./SwitchBase-B8sTL1a5.js";import"./Chip-DLdsXdy8.js";import"./useAnalytics-K4Yw9kGl.js";import"./lodash-CDGQ6Log.js";var a={},d;function q(){if(d)return a;d=1;var r=h(),n=T();Object.defineProperty(a,"__esModule",{value:!0}),a.default=void 0;var c=n(y()),l=r(S()),p=(0,l.default)(c.createElement("path",{d:"M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"}),"Person");return a.default=p,a}var D=q();const I=x(D);var o={},v;function M(){if(v)return o;v=1;var r=h(),n=T();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var c=n(y()),l=r(S()),p=(0,l.default)(c.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"}),"Description");return o.default=p,o}var A=M();const E=x(A),Te={title:"Plugins/Search/SearchType",component:u,decorators:[r=>e.jsx(V,{apis:[[R,new g]],children:e.jsx(P,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:4,children:e.jsx(r,{})})})})})],tags:["!manifest"]},f=["value-1","value-2","value-3"],t=()=>e.jsx(_,{style:{padding:10},children:e.jsx(u,{name:"Search type",values:f,defaultValue:f[0]})}),i=()=>e.jsx(u.Accordion,{name:"Result Types",defaultValue:"value-1",types:[{value:"value-1",name:"Value One",icon:e.jsx(j,{})},{value:"value-2",name:"Value Two",icon:e.jsx(E,{})},{value:"value-3",name:"Value Three",icon:e.jsx(I,{})}]}),s=()=>e.jsx(u.Tabs,{defaultValue:"value-1",types:[{value:"value-1",name:"Value One"},{value:"value-2",name:"Value Two"},{value:"value-3",name:"Value Three"}]});t.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"Accordion"};s.__docgenInfo={description:"",methods:[],displayName:"Tabs"};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const ye=["Default","Accordion","Tabs"];export{i as Accordion,t as Default,s as Tabs,ye as __namedExportsOrder,Te as default};
