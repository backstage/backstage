import{j as t,S as d,a0 as u,$ as h}from"./iframe-ePBrCY0J.js";import{r as g}from"./plugin-B_8XHi5n.js";import{S as m,u as n,a as x}from"./useSearchModal-KWiyzuAo.js";import{B as c}from"./Button-D12VZckj.js";import{D as S,a as f,b as M}from"./DialogTitle-_zti5r9T.js";import{B as j}from"./Box-BIZWnQoQ.js";import{S as r}from"./Grid-CKyhvvof.js";import{S as C}from"./SearchType-B_YCbM34.js";import{L as y}from"./List-Bvl_gPz2.js";import{H as I}from"./DefaultResultListItem-CPjxjdU-.js";import{w as R}from"./appWrappers-BKW6veBJ.js";import{m as B}from"./makeStyles-B9PTu9_J.js";import{s as D,M as k}from"./api-DepSFd-w.js";import{S as v}from"./SearchContext-Bixn0NGW.js";import{SearchBar as T}from"./SearchBar-BlHgl-Qs.js";import{S as b}from"./SearchResult-LMInRxDQ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-8dq_DUxX.js";import"./Plugin-CqkElrxP.js";import"./componentData-CkliWW4d.js";import"./useAnalytics-DJbOQ4-_.js";import"./useApp-BF4JYTvB.js";import"./useRouteRef-DWwHYeG3.js";import"./ArrowForward-D7hR6khY.js";import"./translation-DQBTzNfl.js";import"./Page-CGpi6-50.js";import"./useMediaQuery-DgA1P5Eu.js";import"./Divider-Cq_JEH3o.js";import"./ArrowBackIos-DRvCbpM9.js";import"./ArrowForwardIos-CznuPwcJ.js";import"./translation-CP0xMyBB.js";import"./Modal-D6s-SbHh.js";import"./Portal-IwhLFSRr.js";import"./Backdrop-DesQyrjN.js";import"./styled-CDpOoIv_.js";import"./ExpandMore-8D1cEb8U.js";import"./useAsync-CYOpc47b.js";import"./useMountedState-CkgQ1DIy.js";import"./AccordionDetails-Bypwgwcr.js";import"./index-B9sM2jn7.js";import"./Collapse-DrrnMWQn.js";import"./ListItem-U6U0AzIJ.js";import"./ListContext-3JA2nXVD.js";import"./ListItemIcon-Ci7cL2mv.js";import"./ListItemText-B5XnGeSi.js";import"./Tabs-DpbfIV4O.js";import"./KeyboardArrowRight-qnbd8T9o.js";import"./FormLabel-Bwk9I4JO.js";import"./formControlState-CkRoI_CX.js";import"./InputLabel-D5nJ3L17.js";import"./Select-CDhYqHJU.js";import"./Popover-DEo0R8E-.js";import"./MenuItem-CkaQpwL2.js";import"./Checkbox-BOf6ni39.js";import"./SwitchBase-CdMxyIyY.js";import"./Chip-B4JKWZqV.js";import"./Link-ccW_HqBW.js";import"./index-CGuJQhUk.js";import"./lodash-ByXYgI5E.js";import"./WebStorage-R_XaNAuG.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-BMKp_fr-.js";import"./useIsomorphicLayoutEffect-BhxisjwU.js";import"./BUIProvider-BN8KMri0.js";import"./openLink-DeVepgBP.js";import"./Search-Br48O4Am.js";import"./useDebounce-DKzposbh.js";import"./InputAdornment-C3lk8H8U.js";import"./TextField-C8EZdFY2.js";import"./useElementFilter-695T3_QA.js";import"./EmptyState-KHrib6gt.js";import"./Progress-CFuhASvk.js";import"./LinearProgress-lEnL75jd.js";import"./ResponseErrorPanel-C5dHA9L9.js";import"./ErrorPanel-CCZWyhZF.js";import"./WarningPanel-DefnbV6a.js";import"./MarkdownContent-B9OpY1S2.js";import"./CodeSnippet-Bp5-FRLj.js";import"./CopyTextButton-ScZPcQ2s.js";import"./useCopyToClipboard-B7cxcCPK.js";import"./Tooltip-BVbTMuZj.js";import"./Popper-OUHWMupJ.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},no={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...i.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const co=["Default","CustomModal"];export{s as CustomModal,i as Default,co as __namedExportsOrder,no as default};
