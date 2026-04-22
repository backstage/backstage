import{aP as I,aQ as L,aR as S,aS as j,aE as g,j as t,a2 as D}from"./iframe-CC8dZ5v0.js";import{c as f,D as v}from"./InsertDriveFile-D1BqaQNn.js";import{s as C,M as _}from"./api-D4r0i8Z2.js";import{S as o,c as k}from"./SearchResult-B6Jo4DH9.js";import{L as R}from"./List-D-_F1OrG.js";import{H as n}from"./DefaultResultListItem-Smo4hE-v.js";import{a as N}from"./SearchResultList-FEnAgmm2.js";import{w as q}from"./appWrappers-D9KdZf3h.js";import{L as w}from"./ListItem-B4tF2XTx.js";import{c as E}from"./Plugin-BhEim6P4.js";import{S as A}from"./SearchContext-BWF-VLBq.js";import{L as W}from"./Link-ORDuPGhJ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-Bi_ML6Tf.js";import"./Add-D6v9lC4j.js";import"./ArrowForwardIos-BCvOICAA.js";import"./translation-CXO-2UKF.js";import"./useAnalytics-4dX8X2S1.js";import"./Select-DiStTNdo.js";import"./index-B9sM2jn7.js";import"./Popover-CphrO87E.js";import"./Modal-Zvs4RyO_.js";import"./Portal-COibyzBH.js";import"./formControlState-CT258kkI.js";import"./MenuItem-BNGZSNlf.js";import"./ListSubheader-Cy1cLAqg.js";import"./Chip-aD7C19lk.js";import"./makeStyles-DTH3glJL.js";import"./EmptyState-BdBMH1f7.js";import"./Grid-CCYqzPMW.js";import"./Progress-DlVLgd7k.js";import"./LinearProgress-BgvcftTI.js";import"./Box-BhabvipW.js";import"./styled-CM_Xf2DM.js";import"./ResponseErrorPanel-82b65C3D.js";import"./ErrorPanel-CLfUZ9ms.js";import"./WarningPanel-CIUGXjzm.js";import"./ExpandMore-RARwx0Xw.js";import"./AccordionDetails-C7iUogkW.js";import"./Collapse-0iMZ9ReK.js";import"./MarkdownContent--WfXG79O.js";import"./CodeSnippet-C42Dz4me.js";import"./CopyTextButton-DE0i5KZb.js";import"./useCopyToClipboard-C2Esnc-g.js";import"./useMountedState-BiVC6Sna.js";import"./Tooltip-DdmdxGgY.js";import"./Popper-B3_-o048.js";import"./ListItemText-DP3OOKih.js";import"./ListContext-Bfuv36sR.js";import"./Divider-BDaqKUXC.js";import"./useAsync-Cubaspqz.js";import"./lodash-BzWoCuL2.js";import"./useElementFilter-CSzgEb2h.js";import"./componentData-D7sGMfRh.js";import"./ListItemIcon-BI2dA1qJ.js";import"./WebStorage-LHAAa8QN.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-DaufeE-G.js";import"./useIsomorphicLayoutEffect-BxcoVzAb.js";import"./useApp-DJZpM7fA.js";import"./BUIProvider-Dk-mSEjq.js";import"./openLink-R4xAzZJL.js";import"./useResolvedHref-B0IX69ve.js";import"./useRouteRef-BK6uFU14.js";import"./index-twBdpm7Y.js";var i={},y;function P(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var G=P();const H=g(G),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},Q=new _(M),$t={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,Q]],children:t.jsx(A,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(N,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(H,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=E({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
