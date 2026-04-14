import{bc as T,bd as d,a9 as S,be as v,aa as I,aN as _,aO as j,aP as y,aQ as D,aD as W,j as e,T as k,M as P}from"./iframe-KINrIo_f.js";import{G as L}from"./Group-BE1YVXw6.js";import{H as s}from"./DefaultResultListItem-mWbvTkJd.js";import{C}from"./CssBaseline-DN1gNGfJ.js";import{L as H}from"./LinkButton-B4ryhA6m.js";import{S as g}from"./Grid-FoW9JHab.js";import"./preload-helper-PPVm8Dsz.js";import"./useAnalytics-Cjgpjhm8.js";import"./ListItemIcon-vSBS_DW2.js";import"./ListContext-CxZLnUvv.js";import"./ListItemText-3zlpephB.js";import"./makeStyles-Br0G-hkA.js";import"./Box-DQI8Jhin.js";import"./styled-DYfYOEQM.js";import"./Link-DnWmf_w2.js";import"./index-CIy2Pw8-.js";import"./lodash-Cfs9LtR9.js";import"./useApp-C5R7puQC.js";import"./Button-C_knowQX.js";function b(t){return{props:{MuiGrid:d?.MuiGrid?.defaultProps,MuiSwitch:d?.MuiSwitch?.defaultProps},...S(t)}}function w(t){return v(t,d).overrides}function R(t){const m=b(t),u=T(m),h=w(u);return{...u,overrides:h}}const f=R({palette:I.light});R({palette:I.dark});var o={},x;function q(){if(x)return o;x=1;var t=_(),m=j();Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0;var u=m(y()),h=t(D()),p=(0,h.default)(u.createElement("path",{d:"M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59zM9 13c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"}),"FindInPage");return o.default=p,o}var B=q();const M=W(B),se={title:"Plugins/Search/DefaultResultListItem",component:s,decorators:[t=>e.jsx(P,{children:e.jsx(g,{container:!0,direction:"row",children:e.jsx(g,{item:!0,xs:12,children:e.jsx(t,{})})})})],tags:["!manifest"]},r={location:"search/search-result",title:"Search Result 1",text:"some text from the search result",owner:"some-example-owner"},a=()=>e.jsx(s,{result:r}),i=()=>e.jsx(s,{result:r,icon:e.jsx(M,{color:"primary"})}),n=()=>e.jsx(s,{result:r,secondaryAction:e.jsx(H,{to:"#",size:"small","aria-label":"owner",variant:"text",startIcon:e.jsx(L,{}),style:{textTransform:"lowercase"},children:r.owner})}),c=()=>e.jsx(s,{result:r,highlight:{preTag:"<tag>",postTag:"</tag>",fields:{text:"some <tag>text</tag> from the search result"}}}),l=()=>{const t={...f,overrides:{...f.overrides,BackstageHighlightedSearchResultText:{highlight:{color:"inherit",backgroundColor:"inherit",fontWeight:"bold",textDecoration:"underline"}}}};return e.jsx(k,{theme:t,children:e.jsx(C,{children:e.jsx(s,{result:r,highlight:{preTag:"<tag>",postTag:"</tag>",fields:{text:"some <tag>text</tag> from the search result"}}})})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"WithIcon"};n.__docgenInfo={description:"",methods:[],displayName:"WithSecondaryAction"};c.__docgenInfo={description:"",methods:[],displayName:"WithHighlightedResults"};l.__docgenInfo={description:"",methods:[],displayName:"WithCustomHighlightedResults"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
