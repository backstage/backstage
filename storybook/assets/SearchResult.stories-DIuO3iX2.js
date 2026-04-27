import{aP as I,aQ as L,aR as S,aS as j,aE as g,j as t,a2 as D}from"./iframe-UdCk74ed.js";import{c as f,D as v}from"./InsertDriveFile-U7eTiF9f.js";import{s as C,M as _}from"./api-ST6kqXaL.js";import{S as o,c as k}from"./SearchResult-DOzZYULa.js";import{L as R}from"./List-CFWP97D4.js";import{H as n}from"./DefaultResultListItem-Qiz4oduq.js";import{a as N}from"./SearchResultList-BjyIoqOC.js";import{w as q}from"./appWrappers-V-L692aw.js";import{L as w}from"./ListItem-D0ITxQe3.js";import{c as E}from"./Plugin-CwJz-7RT.js";import{S as A}from"./SearchContext-Cv6UnX9N.js";import{L as W}from"./Link-DW5yfdOI.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DWQJW2DZ.js";import"./Add-BdL2QVHC.js";import"./ArrowForwardIos-DCvL_-LK.js";import"./translation-B_8TqsHv.js";import"./useAnalytics-DsUIDtns.js";import"./Select-BPQdorpW.js";import"./index-B9sM2jn7.js";import"./Popover-CKDAusRL.js";import"./Modal-88nru509.js";import"./Portal-B_bZnr3n.js";import"./formControlState-DDtdeAfY.js";import"./MenuItem-Dn2wl6H5.js";import"./ListSubheader-COqWH-yd.js";import"./Chip-ClK69h0e.js";import"./makeStyles-EOk-SryI.js";import"./EmptyState-GjaGgr4q.js";import"./Grid-DwqHvQ9E.js";import"./Progress-BBoMN1-d.js";import"./LinearProgress-BMOSdfx4.js";import"./Box-sbiym-y5.js";import"./styled-BN87Jrul.js";import"./ResponseErrorPanel-CHUsG7MP.js";import"./ErrorPanel-BmaaGwBt.js";import"./WarningPanel-C960RCQm.js";import"./ExpandMore-DwTkoc5e.js";import"./AccordionDetails-DsLxbANW.js";import"./Collapse-Dq_oeJyM.js";import"./MarkdownContent-ULNUBQMW.js";import"./CodeSnippet-XL-2vNKw.js";import"./CopyTextButton-tqLqfB6x.js";import"./useCopyToClipboard-ByNVH3g5.js";import"./useMountedState-7chJbMUP.js";import"./Tooltip-BMMZ8usS.js";import"./Popper-Ds0Kdlca.js";import"./ListItemText-C5Zs7Dtn.js";import"./ListContext-C8Zyt_3h.js";import"./Divider-CtW3oCa7.js";import"./useAsync-BWSDTMlV.js";import"./lodash-BPf5Z96Y.js";import"./useElementFilter-B6wk_oaL.js";import"./componentData-DfN_GEAU.js";import"./ListItemIcon-fBCHDIjQ.js";import"./WebStorage-z3VDyDN7.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-NqXS6hss.js";import"./useIsomorphicLayoutEffect-C3V_u_Ax.js";import"./useApp-CPPq470-.js";import"./BUIProvider-DWM49Kjg.js";import"./openLink-CyZ-ce7w.js";import"./useResolvedHref-BspT5rIG.js";import"./useRouteRef-ZbTjq9OE.js";import"./index-BZAuc_Yo.js";var i={},y;function P(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var G=P();const H=g(G),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},Q=new _(M),$t={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,Q]],children:t.jsx(A,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(N,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(H,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=E({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
