import{a$ as T,b0 as d,a3 as S,b1 as v,a4 as I,aJ as _,aK as j,aL as y,aM as D,aC as W,j as e,T as k}from"./iframe-7sCYbwMA.js";import{G as L}from"./Group-0Uvi9g8h.js";import{H as s}from"./DefaultResultListItem-Dsnj4TUN.js";import{C}from"./CssBaseline-irRdMczp.js";import{L as P}from"./LinkButton-xbypP_bc.js";import{M as H}from"./index-CohR7ztA.js";import{S as g}from"./Grid-gVLrUN9k.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-5oGCkfyb.js";import"./ListItemIcon-CY7XT_Su.js";import"./ListContext-CefK0ZUa.js";import"./ListItemText-CjPOMK0o.js";import"./makeStyles-B-ZbX8FI.js";import"./Box-CDNKgggc.js";import"./styled-aCG7DPFc.js";import"./Link-Bhg-T8Du.js";import"./index-Cwb1jpWy.js";import"./lodash-CF3MOqf-.js";import"./useApp-BrC99Fm0.js";import"./Button-DgXLVYgc.js";function w(t){return{props:{MuiGrid:d?.MuiGrid?.defaultProps,MuiSwitch:d?.MuiSwitch?.defaultProps},...S(t)}}function b(t){return v(t,d).overrides}function R(t){const m=w(t),u=T(m),h=b(u);return{...u,overrides:h}}const f=R({palette:I.light});R({palette:I.dark});var o={},x;function q(){if(x)return o;x=1;var t=_(),m=j();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var u=m(y()),h=t(D()),p=(0,h.default)(u.createElement("path",{d:"M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59zM9 13c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"}),"FindInPage");return o.default=p,o}var M=q();const B=W(M),oe={title:"Plugins/Search/DefaultResultListItem",component:s,decorators:[t=>e.jsx(H,{children:e.jsx(g,{container:!0,direction:"row",children:e.jsx(g,{item:!0,xs:12,children:e.jsx(t,{})})})})],tags:["!manifest"]},r={location:"search/search-result",title:"Search Result 1",text:"some text from the search result",owner:"some-example-owner"},a=()=>e.jsx(s,{result:r}),i=()=>e.jsx(s,{result:r,icon:e.jsx(B,{color:"primary"})}),n=()=>e.jsx(s,{result:r,secondaryAction:e.jsx(P,{to:"#",size:"small","aria-label":"owner",variant:"text",startIcon:e.jsx(L,{}),style:{textTransform:"lowercase"},children:r.owner})}),c=()=>e.jsx(s,{result:r,highlight:{preTag:"<tag>",postTag:"</tag>",fields:{text:"some <tag>text</tag> from the search result"}}}),l=()=>{const t={...f,overrides:{...f.overrides,BackstageHighlightedSearchResultText:{highlight:{color:"inherit",backgroundColor:"inherit",fontWeight:"bold",textDecoration:"underline"}}}};return e.jsx(k,{theme:t,children:e.jsx(C,{children:e.jsx(s,{result:r,highlight:{preTag:"<tag>",postTag:"</tag>",fields:{text:"some <tag>text</tag> from the search result"}}})})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"WithIcon"};n.__docgenInfo={description:"",methods:[],displayName:"WithSecondaryAction"};c.__docgenInfo={description:"",methods:[],displayName:"WithHighlightedResults"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomHighlightedResults"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
}`,...l.parameters?.docs?.source}}};const ae=["Default","WithIcon","WithSecondaryAction","WithHighlightedResults","WithCustomHighlightedResults"];export{a as Default,l as WithCustomHighlightedResults,c as WithHighlightedResults,i as WithIcon,n as WithSecondaryAction,ae as __namedExportsOrder,oe as default};
