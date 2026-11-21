import{aJ as I,aK as L,aL as S,aM as j,aC as g,j as t,X as D}from"./iframe-SO2aIStn.js";import{c as f,D as v}from"./InsertDriveFile-D5ZOuCBJ.js";import{s as C,M as _}from"./api-Cq6OAgJL.js";import{S as o,c as k}from"./SearchResult-gBhq22Q4.js";import{L as R}from"./List-OkrJGNXg.js";import{H as n}from"./DefaultResultListItem-1hOuLjJB.js";import{a as N}from"./SearchResultList-Br-Is-7J.js";import{w as q}from"./appWrappers-sH140Cw5.js";import{L as w}from"./ListItem-Bat2RRg4.js";import{c as A}from"./Plugin-DOMfypDg.js";import{S as E}from"./SearchContext-DolnY6vn.js";import{L as W}from"./Link-sQvaDLc-.js";import"./preload-helper-PPVm8Dsz.js";import"./index-xNjljL2Y.js";import"./Add-Drpo88DL.js";import"./ArrowForwardIos-CWnd4lUL.js";import"./translation-Ri6--dYY.js";import"./useAnalytics-Dglv9EKv.js";import"./Select-DQh-R_15.js";import"./index-B9sM2jn7.js";import"./Popover-DfZz5ASy.js";import"./Modal-BWwZygZu.js";import"./Portal-Bx0Zszvf.js";import"./formControlState-Dytj21Cg.js";import"./MenuItem-BW9FMTso.js";import"./ListSubheader-B57u_k14.js";import"./Chip-BEpcFNld.js";import"./makeStyles-DqgeW26M.js";import"./EmptyState-4TLCWyg_.js";import"./Grid-DyKyVuYQ.js";import"./Progress-CONg7ax9.js";import"./LinearProgress-CrgDvwfd.js";import"./Box-DWYmvqFk.js";import"./styled-AHWGCPSK.js";import"./ResponseErrorPanel-BxfC9k8b.js";import"./ErrorPanel-r0FOF1ZM.js";import"./WarningPanel-CrThLmgv.js";import"./ExpandMore-B4GmBpcF.js";import"./AccordionDetails-h4hVdFJB.js";import"./Collapse-BFN2NOaJ.js";import"./MarkdownContent-z2y9ctJg.js";import"./ListItemText-DcPsx7kL.js";import"./ListContext-C8Vr105q.js";import"./CopyTextButton-BccbBSmb.js";import"./useCopyToClipboard-B9vry376.js";import"./useMountedState-DKv1wuOp.js";import"./Tooltip-DwIQbKbb.js";import"./useObjectRef-C4fVgNdG.js";import"./useOverlayTriggerState-Ck3aLq9p.js";import"./utils-CwhAgYFH.js";import"./useFocusRing-DHTQT_lC.js";import"./number-pMJydGgE.js";import"./I18nProvider-BWEEs8VU.js";import"./useControlledState-BBNR5rbN.js";import"./animation-CUxQyO9K.js";import"./useHover-BwVq8lt0.js";import"./ButtonIcon-05b3-25k.js";import"./Button-BGvlfnXd.js";import"./Label-DQRKBs9u.js";import"./Hidden-DBz78_xE.js";import"./useLabel-BqXJUdIq.js";import"./useLabels-Cfrddupv.js";import"./useButton-CWlVdGLP.js";import"./usePress-BBc3t8hk.js";import"./textSelection-BFKOQOEH.js";import"./getMetaValue-DQETedN7.js";import"./index-B1nmLjVU.js";import"./Divider-Bat-i2TT.js";import"./CodeSnippet-DrOcwf2_.js";import"./useAsync-BXzo8JBF.js";import"./lodash-DNFIy4FG.js";import"./useElementFilter-DkKgMKyr.js";import"./componentData-quWYn8Ma.js";import"./ListItemIcon-BoFHU3lw.js";import"./WebStorage-DTclgNSG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./index-B44vhErU.js";import"./useObservable-Du-q7c5U.js";import"./useIsomorphicLayoutEffect--isHgD0n.js";import"./useApp-BZeBLv5x.js";import"./BUIProvider-NHPZXdvk.js";import"./useRouteRef-3V3PIu1S.js";import"./index-DPwzdWYf.js";var i={},y;function G(){if(y)return i;y=1;var s=I(),e=L();Object.defineProperty(i,"__esModule",{value:!0}),i.default=void 0;var r=e(S()),u=s(j()),x=(0,u.default)(r.createElement("path",{d:"M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-3v3h-2v-3H8v-2h3v-3h2v3h3v2zm-3-7V3.5L18.5 9H13z"}),"NoteAdd");return i.default=x,i}var H=G();const M=g(H),P={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},z=new _(P),ye={title:"Plugins/Search/SearchResult",component:o,decorators:[s=>q(t.jsx(D,{apis:[[C,z]],children:t.jsx(E,{children:t.jsx(s,{})})}))],tags:["!manifest"]},h=s=>{const{result:e}=s;return t.jsx(w,{children:t.jsxs(W,{to:e.location,children:[e.title," - ",e.text]})})},m=()=>t.jsx(o,{children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),a=()=>{const s={term:"documentation"};return t.jsx(o,{query:s,children:({results:e})=>t.jsx(R,{children:e.map(({type:r,document:u})=>r==="custom-result-item"?t.jsx(h,{result:u},u.location):t.jsx(n,{result:u},u.location))})})},l=()=>t.jsx(o,{children:({results:s})=>t.jsx(N,{resultItems:s,renderResultItem:({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location)})}),c=()=>t.jsx(o,{children:({results:s})=>t.jsxs(t.Fragment,{children:[t.jsx(f,{icon:t.jsx(M,{}),title:"Custom",link:"See all custom results",resultItems:s.filter(({type:e})=>e==="custom-result-item"),renderResultItem:({document:e})=>t.jsx(h,{result:e},e.location)}),t.jsx(f,{icon:t.jsx(v,{}),title:"Default",resultItems:s.filter(({type:e})=>e!=="custom-result-item"),renderResultItem:({document:e})=>t.jsx(n,{result:e},e.location)})]})}),p=()=>t.jsx(o,{noResultsComponent:t.jsx(t.Fragment,{children:"No results were found"}),children:({results:s})=>t.jsx(R,{children:s.map(({type:e,document:r})=>e==="custom-result-item"?t.jsx(h,{result:r},r.location):t.jsx(n,{result:r},r.location))})}),d=()=>{const e=A({id:"plugin"}).provide(k({name:"DefaultResultListItem",component:async()=>n}));return t.jsx(o,{children:t.jsx(e,{})})};m.__docgenInfo={description:"",methods:[],displayName:"Default"};a.__docgenInfo={description:"",methods:[],displayName:"WithQuery"};l.__docgenInfo={description:"",methods:[],displayName:"ListLayout"};c.__docgenInfo={description:"",methods:[],displayName:"GroupLayout"};p.__docgenInfo={description:"",methods:[],displayName:"WithCustomNoResultsComponent"};d.__docgenInfo={description:"",methods:[],displayName:"UsingSearchResultItemExtensions"};m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`() => {
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
}`,...m.parameters?.docs?.source}}};a.parameters={...a.parameters,docs:{...a.parameters?.docs,source:{originalSource:`() => {
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
}`,...a.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`() => {
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
}`,...d.parameters?.docs?.source}}};const xe=["Default","WithQuery","ListLayout","GroupLayout","WithCustomNoResultsComponent","UsingSearchResultItemExtensions"];export{m as Default,c as GroupLayout,l as ListLayout,d as UsingSearchResultItemExtensions,p as WithCustomNoResultsComponent,a as WithQuery,xe as __namedExportsOrder,ye as default};
