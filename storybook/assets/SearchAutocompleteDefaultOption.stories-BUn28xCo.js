import{j as e,T as d}from"./iframe-C6d4amxQ.js";import{S as l,L as n}from"./Label-DUMi-DFW.js";import{s as i,M as x}from"./api-CFhZfUf8.js";import{S as u}from"./SearchContext-Ckc5PXBu.js";import{S as m}from"./Grid-WtUylni-.js";import{L as y}from"./ListItem-CUGV6Izn.js";import"./preload-helper-PPVm8Dsz.js";import"./ListItemIcon-CHICEp0x.js";import"./ListContext-Baa1QRS6.js";import"./ListItemText-DmvyJhay.js";import"./lodash-DLuUt6m8.js";import"./useAsync-C2weF2sY.js";import"./useMountedState-C6W4VPdE.js";import"./useAnalytics-CEJvE44e.js";const H={title:"Plugins/Search/SearchAutocompleteDefaultOption",component:l,decorators:[p=>e.jsx(d,{apis:[[i,new x]],children:e.jsx(u,{children:e.jsx(m,{container:!0,direction:"row",children:e.jsx(m,{item:!0,xs:12,children:e.jsx(y,{children:e.jsx(p,{})})})})})})],tags:["!manifest"]},o=()=>e.jsx(l,{primaryText:"hello-world"}),r=()=>e.jsx(l,{icon:e.jsx(n,{}),primaryText:"hello-world"}),a=()=>e.jsx(l,{primaryText:"hello-world",secondaryText:"Hello World example for gRPC"}),t=()=>e.jsx(l,{icon:e.jsx(n,{}),primaryText:"hello-world",secondaryText:"Hello World example for gRPC"}),s=()=>e.jsx(l,{icon:e.jsx(n,{}),primaryText:"hello-world",primaryTextTypographyProps:{color:"primary"},secondaryText:"Hello World example for gRPC",secondaryTextTypographyProps:{color:"secondary"}}),T=({children:p})=>e.jsx("dt",{children:p}),h=({children:p})=>e.jsx("dd",{children:p}),c=()=>e.jsx("dl",{children:e.jsx(l,{icon:e.jsx(n,{}),primaryText:e.jsx(T,{children:"hello-world"}),secondaryText:e.jsx(h,{children:"Hello World example for gRPC"}),disableTextTypography:!0})});o.__docgenInfo={description:"",methods:[],displayName:"Default"};r.__docgenInfo={description:"",methods:[],displayName:"Icon"};a.__docgenInfo={description:"",methods:[],displayName:"SecondaryText"};t.__docgenInfo={description:"",methods:[],displayName:"AllCombined"};s.__docgenInfo={description:"",methods:[],displayName:"CustomTextTypographies"};c.__docgenInfo={description:"",methods:[],displayName:"CustomTextComponents"};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const Default = () => (
  <SearchAutocompleteDefaultOption primaryText="hello-world" />
);
`,...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Icon = () => (
  <SearchAutocompleteDefaultOption
    icon={<LabelIcon />}
    primaryText="hello-world"
  />
);
`,...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const SecondaryText = () => (
  <SearchAutocompleteDefaultOption
    primaryText="hello-world"
    secondaryText="Hello World example for gRPC"
  />
);
`,...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{code:`const AllCombined = () => (
  <SearchAutocompleteDefaultOption
    icon={<LabelIcon />}
    primaryText="hello-world"
    secondaryText="Hello World example for gRPC"
  />
);
`,...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const CustomTextTypographies = () => (
  <SearchAutocompleteDefaultOption
    icon={<LabelIcon />}
    primaryText="hello-world"
    primaryTextTypographyProps={{ color: "primary" }}
    secondaryText="Hello World example for gRPC"
    secondaryTextTypographyProps={{ color: "secondary" }}
  />
);
`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{code:`const CustomTextComponents = () => (
  <dl>
    <SearchAutocompleteDefaultOption
      icon={<LabelIcon />}
      primaryText={<CustomPrimaryText>hello-world</CustomPrimaryText>}
      secondaryText={
        <CustomSecondaryText>Hello World example for gRPC</CustomSecondaryText>
      }
      disableTextTypography
    />
  </dl>
);
`,...c.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:'() => <SearchAutocompleteDefaultOption primaryText="hello-world" />',...o.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:'() => <SearchAutocompleteDefaultOption icon={<LabelIcon />} primaryText="hello-world" />',...r.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:'() => <SearchAutocompleteDefaultOption primaryText="hello-world" secondaryText="Hello World example for gRPC" />',...a.parameters?.docs?.source}}};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:'() => <SearchAutocompleteDefaultOption icon={<LabelIcon />} primaryText="hello-world" secondaryText="Hello World example for gRPC" />',...t.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => <SearchAutocompleteDefaultOption icon={<LabelIcon />} primaryText="hello-world" primaryTextTypographyProps={{
  color: 'primary'
}} secondaryText="Hello World example for gRPC" secondaryTextTypographyProps={{
  color: 'secondary'
}} />`,...s.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => <dl>
    <SearchAutocompleteDefaultOption icon={<LabelIcon />} primaryText={<CustomPrimaryText>hello-world</CustomPrimaryText>} secondaryText={<CustomSecondaryText>Hello World example for gRPC</CustomSecondaryText>} disableTextTypography />
  </dl>`,...c.parameters?.docs?.source}}};const L=["Default","Icon","SecondaryText","AllCombined","CustomTextTypographies","CustomTextComponents"];export{t as AllCombined,c as CustomTextComponents,s as CustomTextTypographies,o as Default,r as Icon,a as SecondaryText,L as __namedExportsOrder,H as default};
