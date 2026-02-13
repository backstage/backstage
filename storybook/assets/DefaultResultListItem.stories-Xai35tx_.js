import{aQ as T,a2 as S,aR as d,aS as v,a3 as R,aA as k,aB as D,aC as y,aD as L,V as W,j as e,T as _}from"./iframe-DfpqVrvR.js";import{G as j}from"./Group-Bs8kt3JU.js";import{H as c}from"./DefaultResultListItem-BHIxksLb.js";import{M as C}from"./index-Rl36dthR.js";import{S as p}from"./Grid-DytBiILQ.js";import{L as P}from"./LinkButton-DhrKygxP.js";import{C as B}from"./CssBaseline-BPU0JLXb.js";import"./preload-helper-PPVm8Dsz.js";import"./ListItemIcon-BC-oLMvx.js";import"./ListContext-rrXMk-NT.js";import"./ListItemText-DxxiQXUs.js";import"./makeStyles-D6lZMQOZ.js";import"./Box-CBRqSsQo.js";import"./styled-Di8tq9jL.js";import"./useAnalytics-BzwuJCU6.js";import"./Link-Ce-VQ3yZ.js";import"./index-DAuYgPgr.js";import"./lodash-DSlsmB_-.js";import"./useApp-CcVlq-lF.js";import"./Button-Depzz_zY.js";function H(t){return{props:{MuiGrid:d?.MuiGrid?.defaultProps,MuiSwitch:d?.MuiSwitch?.defaultProps},...S(t)}}function w(t){return v(t,d).overrides}function I(t){const m=H(t),u=T(m),h=w(u);return{...u,overrides:h}}const f=I({palette:R.light});I({palette:R.dark});var l={},x;function b(){if(x)return l;x=1;var t=k(),m=D();Object.defineProperty(l,"__esModule",{value:!0}),l.default=void 0;var u=m(y()),h=t(L()),g=(0,h.default)(u.createElement("path",{d:"M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75L20 19.59zM9 13c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3z"}),"FindInPage");return l.default=g,l}var q=b();const F=W(q),oe={title:"Plugins/Search/DefaultResultListItem",component:c,decorators:[t=>e.jsx(C,{children:e.jsx(p,{container:!0,direction:"row",children:e.jsx(p,{item:!0,xs:12,children:e.jsx(t,{})})})})],tags:["!manifest"]},i={location:"search/search-result",title:"Search Result 1",text:"some text from the search result",owner:"some-example-owner"},r=()=>e.jsx(c,{result:i}),s=()=>e.jsx(c,{result:i,icon:e.jsx(F,{color:"primary"})}),o=()=>e.jsx(c,{result:i,secondaryAction:e.jsx(P,{to:"#",size:"small","aria-label":"owner",variant:"text",startIcon:e.jsx(j,{}),style:{textTransform:"lowercase"},children:i.owner})}),a=()=>e.jsx(c,{result:i,highlight:{preTag:"<tag>",postTag:"</tag>",fields:{text:"some <tag>text</tag> from the search result"}}}),n=()=>{const t={...f,overrides:{...f.overrides,BackstageHighlightedSearchResultText:{highlight:{color:"inherit",backgroundColor:"inherit",fontWeight:"bold",textDecoration:"underline"}}}};return e.jsx(_,{theme:t,children:e.jsx(B,{children:e.jsx(c,{result:i,highlight:{preTag:"<tag>",postTag:"</tag>",fields:{text:"some <tag>text</tag> from the search result"}}})})})};r.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"WithIcon"};o.__docgenInfo={description:"",methods:[],displayName:"WithSecondaryAction"};a.__docgenInfo={description:"",methods:[],displayName:"WithHighlightedResults"};n.__docgenInfo={description:"",methods:[],displayName:"WithCustomHighlightedResults"};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{code:`const Default = () => {
  return <DefaultResultListItem result={mockSearchResult} />;
};
`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{code:`const WithIcon = () => {
  return (
    <DefaultResultListItem
      result={mockSearchResult}
      icon={<FindInPageIcon color="primary" />}
    />
  );
};
`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{code:`const WithSecondaryAction = () => {
  return (
    <DefaultResultListItem
      result={mockSearchResult}
      secondaryAction={
        <LinkButton
          to="#"
          size="small"
          aria-label="owner"
          variant="text"
          startIcon={<GroupIcon />}
          style={{ textTransform: "lowercase" }}
        >
          {mockSearchResult.owner}
        </LinkButton>
      }
    />
  );
};
`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{code:`const WithHighlightedResults = () => {
  return (
    <DefaultResultListItem
      result={mockSearchResult}
      highlight={{
        preTag: "<tag>",
        postTag: "</tag>",
        fields: { text: "some <tag>text</tag> from the search result" },
      }}
    />
  );
};
`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{code:`const WithCustomHighlightedResults = () => {
  const customTheme = {
    ...lightTheme,
    overrides: {
      ...lightTheme.overrides,
      BackstageHighlightedSearchResultText: {
        highlight: {
          color: "inherit",
          backgroundColor: "inherit",
          fontWeight: "bold",
          textDecoration: "underline",
        },
      },
    },
  };

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline>
        <DefaultResultListItem
          result={mockSearchResult}
          highlight={{
            preTag: "<tag>",
            postTag: "</tag>",
            fields: { text: "some <tag>text</tag> from the search result" },
          }}
        />
      </CssBaseline>
    </ThemeProvider>
  );
};
`,...n.parameters?.docs?.source}}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} />;
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} icon={<FindInPageIcon color="primary" />} />;
}`,...s.parameters?.docs?.source}}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} secondaryAction={<LinkButton to="#" size="small" aria-label="owner" variant="text" startIcon={<GroupIcon />} style={{
    textTransform: 'lowercase'
  }}>
          {mockSearchResult.owner}
        </LinkButton>} />;
}`,...o.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <DefaultResultListItem result={mockSearchResult} highlight={{
    preTag: '<tag>',
    postTag: '</tag>',
    fields: {
      text: 'some <tag>text</tag> from the search result'
    }
  }} />;
}`,...a.parameters?.docs?.source}}};n.parameters={...n.parameters,docs:{...n.parameters?.docs,source:{originalSource:`() => {
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
}`,...n.parameters?.docs?.source}}};const ae=["Default","WithIcon","WithSecondaryAction","WithHighlightedResults","WithCustomHighlightedResults"];export{r as Default,n as WithCustomHighlightedResults,a as WithHighlightedResults,s as WithIcon,o as WithSecondaryAction,ae as __namedExportsOrder,oe as default};
