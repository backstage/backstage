import{cf as I,cg as L,cj as S,ce as j,bu as g,bR as t,a5 as D}from"./iframe-hQz1Bovf.js";import{a as f,D as v}from"./InsertDriveFile-CVdpAMpd.js";import{s as C,M as _}from"./api-BZvFwtZ-.js";import{S as o,c as k}from"./SearchResult-BEeQK5f9.js";import{L as R}from"./List-Czan3J2f.js";import{H as n}from"./DefaultResultListItem-_H_bKm5c.js";import{a as N}from"./SearchResultList-pD0uRh3o.js";import{O as q}from"./appWrappers-CJxi5nTM.js";import{L as w}from"./ListItem-Cj74SqHm.js";import{a as A}from"./Plugin-HUDQS0ex.js";import{S as E}from"./SearchContext-BHVfRQdn.js";import{L as W}from"./Link-Bcq4-4Is.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B0xtEfPb.js";import"./Add-BCgTW8CL.js";import"./ArrowForwardIos-BJjyatSp.js";import"./translation-D_RLyocF.js";import"./useAnalytics-1xUyB9Hg.js";import"./Select-D4kv8PKN.js";import"./index-B9sM2jn7.js";import"./Popover-DfiFNTXi.js";import"./Modal-DvhKrn83.js";import"./Portal-CPzfTq6t.js";import"./formControlState-Dy7ehpEY.js";import"./MenuItem-DcJ8_era.js";import"./ListSubheader-CFdtgsjE.js";import"./Chip-VKkLHmRL.js";import"./makeStyles-CRkWSsAX.js";import"./EmptyState-CBQY7kOH.js";import"./Grid-BHtxnF4E.js";import"./Progress-Dgwx3OCu.js";import"./LinearProgress-CUWHmKoH.js";import"./Box-CFfSeaSI.js";import"./styled-DjRvED2X.js";import"./ResponseErrorPanel-BdMSXBjO.js";import"./ErrorPanel-C9NtZi6r.js";import"./WarningPanel-EdrGZVs0.js";import"./ExpandMore-Cxdbkgw6.js";import"./AccordionDetails-B6N32r7a.js";import"./Collapse-DtRwyC7m.js";import"./MarkdownContent-bRZBSpSh.js";import"./CodeSnippet-DZEoL2eY.js";import"./ListItemText-DkoBDy6-.js";import"./ListContext-Dkj8oSFA.js";import"./CopyTextButton-BuvWXcdK.js";import"./useCopyToClipboard-fpXyZL8l.js";import"./useMountedState-C3piaHue.js";import"./Tooltip-SafoiP2J.js";import"./Popper-BEk1nR9x.js";import"./Divider-DiKZVb6z.js";import"./useAsync-D_bIKH8Q.js";import"./lodash-BeTb6-To.js";import"./useElementFilter-Dd1GnSA1.js";import"./componentData-sXvL-Mp_.js";import"./ListItemIcon-DCQWzmKr.js";import"./WebStorage-CyAycpaY.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-D_qXwQQN.js";import"./useIsomorphicLayoutEffect-DQt7gRcN.js";import"./useApp-CNSTaFkm.js";import"./BUIProvider-DrhB4dcF.js";import"./openLink-B-dyxHNl.js";import"./useResolvedHref-CyacsD8B.js";import"./useRouteRef-C1JVUiPG.js";import"./index-tlBBGTW_.js";var i={},y;function G(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var H=G();const P=g(H),M={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},O=new _(M),$t={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,O]],children:t.jsx(E,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},a=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),m=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(N,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(P,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=A({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};a.__docgenInfo={description:"",methods:[],displayName:"Default"};m.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
