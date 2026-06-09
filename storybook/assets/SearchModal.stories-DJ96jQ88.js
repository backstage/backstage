import{bR as t,u as d,l as u,a5 as h}from"./iframe-Bfn8Z101.js";import{r as g}from"./plugin-X2ARva71.js";import{S as m,u as n,b as x}from"./useSearchModal-DG0vtfp0.js";import{B as c}from"./Button-xxjLWKEQ.js";import{c as S,b as f,a as M}from"./DialogTitle-8ACHlAna.js";import{B as j}from"./Box-DyfwZbNL.js";import{S as r}from"./Grid-DmJYnAGe.js";import{S as C}from"./SearchType-DCIG2WfU.js";import{L as y}from"./List-D_LcnGoX.js";import{H as R}from"./DefaultResultListItem-C9LAWeTE.js";import{O as I}from"./appWrappers-LbGSXi6d.js";import{m as B}from"./makeStyles-CYTyANLm.js";import{s as D,M as b}from"./api-BpId_hhA.js";import{S as k}from"./SearchContext-CEWscKAG.js";import{SearchBar as v}from"./SearchBar-OZezmSA2.js";import{S as T}from"./SearchResult-CWy1oRJr.js";import"./preload-helper-PPVm8Dsz.js";import"./index-abunPoFB.js";import"./Plugin-s6Zqprqk.js";import"./componentData-CYQ8Hx3d.js";import"./useAnalytics-DIVjLHv8.js";import"./useApp-CcgvpO7S.js";import"./useRouteRef-CWFArtZI.js";import"./ArrowForward-8ZFhl_WO.js";import"./translation-BJoi-8wD.js";import"./Page-BB6RlXTV.js";import"./useMediaQuery-DxAoH8qr.js";import"./Divider-BFtZrrTK.js";import"./ArrowBackIos-DKSWcesG.js";import"./ArrowForwardIos-DtD7ZeZ3.js";import"./translation-StHV6l65.js";import"./Modal-Q6OKoPg0.js";import"./Portal-D_3zuTLc.js";import"./Backdrop-DmAcb1Cx.js";import"./styled-DuMxEeiS.js";import"./ExpandMore-BrDQI5pA.js";import"./useAsync-CVtVRe6i.js";import"./useMountedState-rGIgLhw9.js";import"./AccordionDetails-ZzhV-uiE.js";import"./index-B9sM2jn7.js";import"./Collapse-BGPXZjiz.js";import"./ListItem-DWsGqw5Q.js";import"./ListContext-CfWmSMOg.js";import"./ListItemIcon-BEbwOgGy.js";import"./ListItemText-Du2ZLDvg.js";import"./Tabs-Cp4GHK41.js";import"./KeyboardArrowRight-CijgYtBW.js";import"./FormLabel-Pj30kDWO.js";import"./formControlState-BiTqe44b.js";import"./InputLabel-YF13KvG-.js";import"./Select-i97LFYot.js";import"./Popover-DqZKjMJv.js";import"./MenuItem-C9-qGFTS.js";import"./Checkbox-C0_XiBnl.js";import"./SwitchBase-CcrIs0Y1.js";import"./Chip-DGuzL_7A.js";import"./Link-DTk0cCR5.js";import"./index-B5yD2poE.js";import"./lodash-UuYECw1e.js";import"./WebStorage-gfOf3SZt.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-B2zfavYX.js";import"./useIsomorphicLayoutEffect-zHC9lh2S.js";import"./BUIProvider-ConZhciV.js";import"./openLink-Wmfxce7-.js";import"./useResolvedHref-DALv23Nx.js";import"./Search-7Fgs2zEz.js";import"./useDebounce-CVsMld2Y.js";import"./InputAdornment-CPdc_sik.js";import"./TextField-C5DJWQZd.js";import"./useElementFilter-DaSc5Fxk.js";import"./EmptyState-YYqXRfZd.js";import"./Progress-DUdgFn7x.js";import"./LinearProgress-CVJxY-Xz.js";import"./ResponseErrorPanel-CL0JaHZD.js";import"./ErrorPanel-CnSNbfKU.js";import"./WarningPanel-aoq1NUzX.js";import"./MarkdownContent-8h_YE049.js";import"./CodeSnippet-B4OvzZ7R.js";import"./CopyTextButton-tGo86gyy.js";import"./useCopyToClipboard-iO9LRwGx.js";import"./Tooltip-rbGTp7Gl.js";import"./Popper-CojVdIgS.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>I(t.jsx(h,{apis:[[D,new b(G)]],children:t.jsx(k,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(T,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
