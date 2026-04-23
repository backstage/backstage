import{j as t,W as d,a3 as u,a2 as h}from"./iframe-BkP0WlJq.js";import{r as g}from"./plugin-CNDM1upN.js";import{S as l,u as n,a as x}from"./useSearchModal-CD4Gpqka.js";import{B as c}from"./Button-BlfEvuWY.js";import{D as S,a as f,b as M}from"./DialogTitle-0GGe6JvP.js";import{B as j}from"./Box-CtyD_mKx.js";import{S as r}from"./Grid-CJH0jvjV.js";import{S as C}from"./SearchType-7I_x5Ufz.js";import{L as y}from"./List-D9EXf02M.js";import{H as I}from"./DefaultResultListItem-3hr5R9T1.js";import{w as R}from"./appWrappers-aBx4amFA.js";import{m as B}from"./makeStyles-x_iRcUX-.js";import{s as D,M as k}from"./api-B4Zi2N1t.js";import{S as v}from"./SearchContext-BQ1BJQWl.js";import{SearchBar as T}from"./SearchBar-C8786lXe.js";import{S as b}from"./SearchResult-HlQHQQqg.js";import"./preload-helper-PPVm8Dsz.js";import"./index-eZE5HfFN.js";import"./Plugin-BsA3cme9.js";import"./componentData-DjDFt7vN.js";import"./useAnalytics-C3NR7LVW.js";import"./useApp-BPVHau74.js";import"./useRouteRef-CKGz1o61.js";import"./ArrowForward-Dao4Cjwh.js";import"./translation-ChUO6x30.js";import"./Page-7VpCq1dW.js";import"./useMediaQuery-CShEnKh3.js";import"./Divider-D-W5xIPe.js";import"./ArrowBackIos-BWNkMHg8.js";import"./ArrowForwardIos-B-jetywU.js";import"./translation-uEFjMrEj.js";import"./Modal-B3xtW-GN.js";import"./Portal-DFAos_7D.js";import"./Backdrop-wPuVUD4R.js";import"./styled-DkvpMltq.js";import"./ExpandMore-BDHE7-PU.js";import"./useAsync-CQa4W9mS.js";import"./useMountedState-BhIqHF6i.js";import"./AccordionDetails-Bwt7PtDW.js";import"./index-B9sM2jn7.js";import"./Collapse-JsIOSjTx.js";import"./ListItem-Dhi0hwUe.js";import"./ListContext-JoB9gWoY.js";import"./ListItemIcon-Ct0ZTEtt.js";import"./ListItemText-BwIfrCIq.js";import"./Tabs-DuJAuKsd.js";import"./KeyboardArrowRight-DfufMIvw.js";import"./FormLabel-DkFpiFn1.js";import"./formControlState-T-Mp6z2F.js";import"./InputLabel-HPKDqHLk.js";import"./Select-C7apypw9.js";import"./Popover-CKUtrh1p.js";import"./MenuItem-Bdko0rzX.js";import"./Checkbox-B1FqzgTG.js";import"./SwitchBase-CMFSixh4.js";import"./Chip-BIqrFoAC.js";import"./Link-BxRVLp8M.js";import"./index-ghTZu97H.js";import"./lodash-BwZXkg-A.js";import"./WebStorage-paXrvi2X.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CI_ZEXKZ.js";import"./useIsomorphicLayoutEffect-J7YniEyE.js";import"./BUIProvider-CPBk8mPw.js";import"./openLink-DB0Ca1x8.js";import"./useResolvedHref-B_fCet1Y.js";import"./Search-DILP1Q-u.js";import"./useDebounce-dHyJ23v-.js";import"./InputAdornment-Mhrog0pQ.js";import"./TextField-KEE0Vbp0.js";import"./useElementFilter-CW1lM9c-.js";import"./EmptyState-BYubRcqS.js";import"./Progress-CSeC_6h0.js";import"./LinearProgress-CduyLHCS.js";import"./ResponseErrorPanel-qwd5N6Ky.js";import"./ErrorPanel-B-RLv-ak.js";import"./WarningPanel-5BustiD6.js";import"./MarkdownContent-iEu8rAa0.js";import"./CodeSnippet-Bz4Oium0.js";import"./CopyTextButton-D_QuNntK.js";import"./useCopyToClipboard-BMK4jvzc.js";import"./Tooltip-B0A8oVTS.js";import"./Popper-AR2CJIOS.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
}`,...s.parameters?.docs?.source}}};const po=["Default","CustomModal"];export{s as CustomModal,i as Default,po as __namedExportsOrder,co as default};
