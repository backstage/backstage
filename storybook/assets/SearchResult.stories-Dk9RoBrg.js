import{aQ as I,aR as L,aS as S,aT as j,aE as g,j as t,a2 as D}from"./iframe-Cm1o1Xbd.js";import{c as f,D as v}from"./InsertDriveFile-C9Os0gKx.js";import{s as C,M as _}from"./api-Cn7FDnlb.js";import{S as o,c as k}from"./SearchResult-D4Ok7I7y.js";import{L as R}from"./List-DSQEbQUU.js";import{H as n}from"./DefaultResultListItem-DQ7Anwru.js";import{a as N}from"./SearchResultList-BTZ_f7yF.js";import{w as q}from"./appWrappers-BunfmKJx.js";import{L as w}from"./ListItem-B3id05WU.js";import{c as E}from"./Plugin-BW5DJCkR.js";import{S as A}from"./SearchContext-DMcG2vUe.js";import{L as W}from"./Link-BujjMqyX.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BQdDpX6M.js";import"./Add-bKgtEqaU.js";import"./ArrowForwardIos-CWQk2RGG.js";import"./translation-CSs5G3Vr.js";import"./useAnalytics-BEwOoq4N.js";import"./Select-CLzuZyA4.js";import"./index-B9sM2jn7.js";import"./Popover-CsHm-zYv.js";import"./Modal-DcI2lTu0.js";import"./Portal-BCJJ0GKL.js";import"./formControlState-Dz--SRMG.js";import"./MenuItem-uZ8io8GD.js";import"./ListSubheader-DB2kYvsR.js";import"./Chip-C57kDIBJ.js";import"./makeStyles-CgDsK_IC.js";import"./EmptyState-Bp4ZXssO.js";import"./Grid-Bci0B9zS.js";import"./Progress-O1qgyKds.js";import"./LinearProgress-Cf80kNZS.js";import"./Box-H3EEpFmb.js";import"./styled-CDaxGVWn.js";import"./ResponseErrorPanel-CcZVdkJl.js";import"./ErrorPanel-BiGslUfc.js";import"./WarningPanel-Dr3kzVSN.js";import"./ExpandMore-FnfrAYVB.js";import"./AccordionDetails-BAp-U8Z2.js";import"./Collapse-BYA1yqoX.js";import"./MarkdownContent-D5BAVgm9.js";import"./CodeSnippet-JBqL3FbK.js";import"./CopyTextButton-DS8F_NJm.js";import"./useCopyToClipboard-CxDIm2O1.js";import"./useMountedState-Blvo2f43.js";import"./Tooltip-CCT5u6cY.js";import"./Popper-FZKJk7TA.js";import"./ListItemText-BOtbiPEf.js";import"./ListContext-Bcv2AtVr.js";import"./Divider-D_U4zSui.js";import"./useAsync-GF3_H2EU.js";import"./lodash-DTaZxSKz.js";import"./useElementFilter-BdT6mkQa.js";import"./componentData-ClFrh1_L.js";import"./ListItemIcon-BnX2k0gC.js";import"./WebStorage-MrEjFDxR.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CI_yBCl2.js";import"./useIsomorphicLayoutEffect-BlGD8AVz.js";import"./useApp-Pblw4TFB.js";import"./BUIProvider-BvKJ30ug.js";import"./openLink-D5lxhsMC.js";import"./useResolvedHref-DkoMOC3w.js";import"./useRouteRef-BzSmmp13.js";import"./index-Dmtd4Pzp.js";var i={},y;function G(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var H=G();const P=g(H),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},Q=new _(M),$t={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,Q]],children:t.jsx(A,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(N,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(P,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=E({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult>
      {({
      results
    }) => <List>
          {results.map(({
        type,
        document
      }) => {
        switch (type) {
          case 'custom-result-item':
            return <CustomResultListItem key={document.location} result={document} />;
          default:
            return <DefaultResultListItem key={document.location} result={document} />;
        }
      })}
        </List>}
    </SearchResult>;
}`,...a.parameters?.docs?.source}}};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
  const query = {
    term: 'documentation'
  };
  return <SearchResult query={query}>
      {({
      results
    }) => <List>
          {results.map(({
        type,
        document
      }) => {
        switch (type) {
          case 'custom-result-item':
            return <CustomResultListItem key={document.location} result={document} />;
          default:
            return <DefaultResultListItem key={document.location} result={document} />;
        }
      })}
        </List>}
    </SearchResult>;
}`,...m.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult>
      {({
      results
    }) => <SearchResultListLayout resultItems={results} renderResultItem={({
      type,
      document
    }) => {
      switch (type) {
        case 'custom-result-item':
          return <CustomResultListItem key={document.location} result={document} />;
        default:
          return <DefaultResultListItem key={document.location} result={document} />;
      }
    }} />}
    </SearchResult>;
}`,...l.parameters?.docs?.source}}};c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult>
      {({
      results
    }) => <>
          <SearchResultGroupLayout icon={<CustomIcon />} title="Custom" link="See all custom results" resultItems={results.filter(({
        type
      }) => type === 'custom-result-item')} renderResultItem={({
        document
      }) => <CustomResultListItem key={document.location} result={document} />} />
          <SearchResultGroupLayout icon={<DefaultIcon />} title="Default" resultItems={results.filter(({
        type
      }) => type !== 'custom-result-item')} renderResultItem={({
        document
      }) => <DefaultResultListItem key={document.location} result={document} />} />
        </>}
    </SearchResult>;
}`,...c.parameters?.docs?.source}}};p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`() => {
  return <SearchResult noResultsComponent={<>No results were found</>}>
      {({
      results
    }) => <List>
          {results.map(({
        type,
        document
      }) => {
        switch (type) {
          case 'custom-result-item':
            return <CustomResultListItem key={document.location} result={document} />;
          default:
            return <DefaultResultListItem key={document.location} result={document} />;
        }
      })}
        </List>}
    </SearchResult>;
}`,...p.parameters?.docs?.source}}};d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`() => {
  const plugin = createPlugin({
    id: 'plugin'
  });
  const DefaultResultItem = plugin.provide(createSearchResultListItemExtension({
    name: 'DefaultResultListItem',
    component: async () => DefaultResultListItem
  }));
  return <SearchResult>
      <DefaultResultItem />
    </SearchResult>;
}`,...d.parameters?.docs?.source}}};const te=["Default","WithQuery","ListLayout","GroupLayout","WithCustomNoResultsComponent","UsingSearchResultItemExtensions"];export{a as Default,c as GroupLayout,l as ListLayout,d as UsingSearchResultItemExtensions,p as WithCustomNoResultsComponent,m as WithQuery,te as __namedExportsOrder,$t as default};
