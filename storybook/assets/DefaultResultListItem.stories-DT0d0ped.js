import{ba as T,bb as d,ad as S,bc as v,ae as I,aV as _,aW as j,aX as y,aY as W,aM as D,j as e,T as k,M as L}from"./iframe-BIybnMXI.js";import{G as P}from"./Group-BE-0_fJZ.js";import{H as s}from"./DefaultResultListItem-BTA7tOdM.js";import{C}from"./CssBaseline-CUS0098G.js";import{L as b}from"./LinkButton-BiEwFaYZ.js";import{S as g}from"./Grid-CKJ_Bjce.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-Cee1mTCP.js";import"./ListItemIcon-B2viDiqc.js";import"./ListContext-Dy9wnKpt.js";import"./ListItemText-2j2zbfbt.js";import"./makeStyles-cGXTSjHb.js";import"./Box-DUmu2mdv.js";import"./styled-BLvF1qNR.js";import"./Link-DXi97D8o.js";import"./index-C71EKvje.js";import"./lodash-BF9MgLAH.js";import"./useApp-B-DAdzWT.js";import"./Button-DKkXzZEj.js";function H(t){return{props:{MuiGrid:d?.MuiGrid?.defaultProps,MuiSwitch:d?.MuiSwitch?.defaultProps},...S(t)}}function w(t){return v(t,d).overrides}function R(t){const m=H(t),u=T(m),h=w(u);return{...u,overrides:h}}const f=R({palette:I.light});R({palette:I.dark});var o={},x;function q(){if(x)return o;x=1;var t=_(),m=j();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var u=m(y()),h=t(W()),p=(0,h.default)(u.createElement("path",{d:"M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59zM9 13c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"}),"FindInPage");return o.default=p,o}var M=q();const B=D(M),se={title:"Plugins/Search/DefaultResultListItem",component:s,decorators:[t=>e.jsx(L,{children:e.jsx(g,{container:!0,direction:"row",children:e.jsx(g,{item:!0,xs:12,children:e.jsx(t,{})})})})],tags:["!manifest"]},r={location:"search/search-result",title:"Search Result 1",text:"some text from the search result",owner:"some-example-owner"},a=()=>e.jsx(s,{result:r}),i=()=>e.jsx(s,{result:r,icon:e.jsx(B,{color:"primary"})}),n=()=>e.jsx(s,{result:r,secondaryAction:e.jsx(b,{to:"#",size:"small","aria-label":"owner",variant:"text",startIcon:e.jsx(P,{}),style:{textTransform:"lowercase"},children:r.owner})}),c=()=>e.jsx(s,{result:r,highlight:{preTag:"<tag>",postTag:"</tag>",fields:{text:"some <tag>text</tag> from the search result"}}}),l=()=>{const t={...f,overrides:{...f.overrides,BackstageHighlightedSearchResultText:{highlight:{color:"inherit",backgroundColor:"inherit",fontWeight:"bold",textDecoration:"underline"}}}};return e.jsx(k,{theme:t,children:e.jsx(C,{children:e.jsx(s,{result:r,highlight:{preTag:"<tag>",postTag:"</tag>",fields:{text:"some <tag>text</tag> from the search result"}}})})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"WithIcon"};n.__docgenInfo={description:"",methods:[],displayName:"WithSecondaryAction"};c.__docgenInfo={description:"",methods:[],displayName:"WithHighlightedResults"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomHighlightedResults"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} />;
}`,...a.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} icon={<FindInPageIcon color="primary" />} />;
}`,...i.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} secondaryAction={<LinkButton to="#" size="small" aria-label="owner" variant="text" startIcon={<GroupIcon />} style={{
    textTransform: 'lowercase'
  }}>
          {mockSearchResult.owner}
        </LinkButton>} />;
}`,...n.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} highlight={{
    preTag: '<tag>',
    postTag: '</tag>',
    fields: {
      text: 'some <tag>text</tag> from the search result'
    }
  }} />;
}`,...c.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
  const customTheme = {
    ...lightTheme,
    overrides: {
      ...lightTheme.overrides,
      BackstageHighlightedSearchResultText: {
        highlight: {
          color: 'inherit',
          backgroundColor: 'inherit',
          fontWeight: 'bold',
          textDecoration: 'underline'
        }
      }
    }
  };
  return <ThemeProvider theme={customTheme}>
      <CssBaseline>
        <DefaultResultListItem result={mockSearchResult} highlight={{
        preTag: '<tag>',
        postTag: '</tag>',
        fields: {
          text: 'some <tag>text</tag> from the search result'
        }
      }} />
      </CssBaseline>
    </ThemeProvider>;
}`,...l.parameters?.docs?.source}}};const oe=["Default","WithIcon","WithSecondaryAction","WithHighlightedResults","WithCustomHighlightedResults"];export{a as Default,l as WithCustomHighlightedResults,c as WithHighlightedResults,i as WithIcon,n as WithSecondaryAction,oe as __namedExportsOrder,se as default};
