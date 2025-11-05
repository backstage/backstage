import{j as t,m as d,I as u,b as h,T as g}from"./iframe-CjPeRtpr.js";import{r as x}from"./plugin-q9q1rT_r.js";import{S as m,u as n,a as S}from"./useSearchModal-XmGdVHxc.js";import{B as c}from"./Button-BBexx9Xc.js";import{a as f,b as M,c as j}from"./DialogTitle-BwKasQ9h.js";import{B as C}from"./Box-Clo5S76h.js";import{S as r}from"./Grid-C-Nq5_yH.js";import{S as y}from"./SearchType-fXWLsIoq.js";import{L as I}from"./List-viPECRg_.js";import{H as R}from"./DefaultResultListItem-BNTV6qg4.js";import{s as B,M as D}from"./api-D0Qp0-Td.js";import{S as T}from"./SearchContext-D_j5kfek.js";import{w as k}from"./appWrappers-C7xvnveN.js";import{SearchBar as v}from"./SearchBar-Ba67AekM.js";import{a as b}from"./SearchResult-CueeMyqS.js";import"./preload-helper-D9Z9MdNV.js";import"./index-Bs5sAiYh.js";import"./Plugin-By9pZykQ.js";import"./componentData-BESRmA5Y.js";import"./useAnalytics-CKVjVoDQ.js";import"./useApp-BDYwb5CO.js";import"./useRouteRef-aNZDBX5J.js";import"./index-o3KEuSlS.js";import"./ArrowForward-D3dovPjI.js";import"./translation-RRjVAs6i.js";import"./Page-CQLD4wFq.js";import"./useMediaQuery-Q-oGJBO-.js";import"./Divider-CTYbgud9.js";import"./ArrowBackIos-D822k3uA.js";import"./ArrowForwardIos-BXMOOA0Q.js";import"./translation-CKLfrRbW.js";import"./Modal-CJx3g85d.js";import"./Portal-DbRgE8W4.js";import"./Backdrop-BucF1-y1.js";import"./styled-HkKxam_j.js";import"./ExpandMore-Cc9LWRDz.js";import"./useAsync-D_X77wsO.js";import"./useMountedState-_t540rGO.js";import"./AccordionDetails-DEzX30Kp.js";import"./index-DnL3XN75.js";import"./Collapse-CKqt3vm7.js";import"./ListItem-DXifIexk.js";import"./ListContext-B6QifY9s.js";import"./ListItemIcon-BCG-2iZm.js";import"./ListItemText-DslgGDwr.js";import"./Tabs-Ycq1Wty0.js";import"./KeyboardArrowRight-c6IGxL9o.js";import"./FormLabel-CED2Jl1P.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Dh_K_syj.js";import"./InputLabel-BT31BMNY.js";import"./Select-C9pSJE1i.js";import"./Popover-CtBABBeq.js";import"./MenuItem-IieluMYu.js";import"./Checkbox-2qZb2xXX.js";import"./SwitchBase-E28p-qiK.js";import"./Chip-CdqLF919.js";import"./Link-C_RbsuLk.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-BgsOv5AO.js";import"./useIsomorphicLayoutEffect-DOJbEOhC.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-B2Ql5ECB.js";import"./useDebounce-DMlSaAEa.js";import"./InputAdornment-7uGDBv4V.js";import"./TextField-D66ohS81.js";import"./useElementFilter-CGkTlefc.js";import"./EmptyState-kCwQMIf3.js";import"./Progress-BQZXfCmC.js";import"./LinearProgress-CQOliNIP.js";import"./ResponseErrorPanel-Bph5TOf_.js";import"./ErrorPanel-By3NRS2J.js";import"./WarningPanel-qGQeTBaX.js";import"./MarkdownContent-B1Y4fp3A.js";import"./CodeSnippet-BmcxidKZ.js";import"./CopyTextButton-pFjOigu_.js";import"./useCopyToClipboard-Cab7YRdZ.js";import"./Tooltip-D2MzRiUK.js";import"./Popper-Daug_pz5.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal} />
    </>;
}`,...s.parameters?.docs?.source}}};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
  const classes = useStyles();
  const {
    state,
    toggleModal
  } = useSearchModal();
  return <>
      <Button variant="contained" color="primary" onClick={toggleModal}>
        Toggle Custom Search Modal
      </Button>
      <SearchModal {...state} toggleModal={toggleModal}>
        {() => <>
            <DialogTitle>
              <Box className={classes.titleContainer}>
                <SearchBar className={classes.input} />

                <IconButton aria-label="close" onClick={toggleModal}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Grid container direction="column">
                <Grid item>
                  <SearchType.Tabs defaultValue="" types={[{
                value: 'custom-result-item',
                name: 'Custom Item'
              }, {
                value: 'no-custom-result-item',
                name: 'No Custom Item'
              }]} />
                </Grid>
                <Grid item>
                  <SearchResult>
                    {({
                  results
                }) => <List>
                        {results.map(({
                    document
                  }) => <div role="button" tabIndex={0} key={\`\${document.location}-btn\`} onClick={toggleModal} onKeyPress={toggleModal}>
                            <DefaultResultListItem key={document.location} result={document} />
                          </div>)}
                      </List>}
                  </SearchResult>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className={classes.dialogActionsContainer}>
              <Grid container direction="row">
                <Grid item xs={12}>
                  <SearchResultPager />
                </Grid>
              </Grid>
            </DialogActions>
          </>}
      </SearchModal>
    </>;
}`,...i.parameters?.docs?.source}}};const lo=["Default","CustomModal"];export{i as CustomModal,s as Default,lo as __namedExportsOrder,ao as default};
