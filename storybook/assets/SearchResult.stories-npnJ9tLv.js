import{aP as I,aQ as L,aR as S,aS as j,aE as g,j as t,a2 as D}from"./iframe-CsCfxPn_.js";import{c as f,D as v}from"./InsertDriveFile-Dkam7rYc.js";import{s as C,M as _}from"./api-CpAFkP7v.js";import{S as o,c as k}from"./SearchResult-B9i6w4Pg.js";import{L as R}from"./List-BOkqMN_K.js";import{H as n}from"./DefaultResultListItem-DBa5MyE2.js";import{a as N}from"./SearchResultList-CUGnGPq-.js";import{w as q}from"./appWrappers-B9IK4atE.js";import{L as w}from"./ListItem-DLLda7RJ.js";import{c as E}from"./Plugin-Brd-M73I.js";import{S as A}from"./SearchContext-BFk6HlnE.js";import{L as W}from"./Link-BZkyGUYJ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BEfEUu9U.js";import"./Add-B9fea0kl.js";import"./ArrowForwardIos-CBiIX6HM.js";import"./translation-8GdlkoAv.js";import"./useAnalytics-w4gYjMWf.js";import"./Select-SaMwXIqU.js";import"./index-B9sM2jn7.js";import"./Popover-B3s2h15z.js";import"./Modal-Bpr0arJu.js";import"./Portal-Mjfg2QfE.js";import"./formControlState-CtyFG1bY.js";import"./MenuItem-BNpo4vkR.js";import"./ListSubheader-tqkWQsun.js";import"./Chip-DKM9i7tp.js";import"./makeStyles-Cyq7q47K.js";import"./EmptyState-nI1dRGJN.js";import"./Grid-BYa8idma.js";import"./Progress-gl1ElNMR.js";import"./LinearProgress-ZkmiOVRR.js";import"./Box-B59PrcF8.js";import"./styled-BhaEuEq4.js";import"./ResponseErrorPanel-Dp1oup9Z.js";import"./ErrorPanel-DytSTv92.js";import"./WarningPanel-DOkLgdmd.js";import"./ExpandMore-B9sgAbKb.js";import"./AccordionDetails-BQZ4KF5G.js";import"./Collapse-C8jxEJfU.js";import"./MarkdownContent-Cr-4rCA9.js";import"./CodeSnippet-D-7-vDxV.js";import"./CopyTextButton-Dz_soge8.js";import"./useCopyToClipboard-Cqod-UND.js";import"./useMountedState-BfmURTRU.js";import"./Tooltip-DGsNX3s4.js";import"./Popper-CCu5RvlF.js";import"./ListItemText-Bb_WjaoQ.js";import"./ListContext-COVYUNkn.js";import"./Divider-ENESGlaF.js";import"./useAsync-BnuMT2jk.js";import"./lodash-CbHAjvV7.js";import"./useElementFilter-DPoWGLlH.js";import"./componentData-CHkqD8ZG.js";import"./ListItemIcon-DbUr_XUW.js";import"./WebStorage-OFUHyLIx.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CQg4fRRq.js";import"./useIsomorphicLayoutEffect-BDGfUn1p.js";import"./useApp-C_ncuDBH.js";import"./BUIProvider-Chhfm5Ik.js";import"./openLink-BrP_7GAS.js";import"./useResolvedHref-QiPi986T.js";import"./useRouteRef-D_n0iugk.js";import"./index-BnA6fLC5.js";var i={},y;function P(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var G=P();const H=g(G),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},Q=new _(M),$t={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,Q]],children:t.jsx(A,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(N,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(H,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=E({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
