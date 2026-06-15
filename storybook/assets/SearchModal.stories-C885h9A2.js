import{bR as t,u as d,l as u,a5 as h}from"./iframe-NUkawwzR.js";import{r as g}from"./plugin-CfH5c-xw.js";import{S as m,u as n,b as x}from"./useSearchModal-DYUolT5M.js";import{B as c}from"./Button-CdpMcnou.js";import{c as S,b as f,a as M}from"./DialogTitle--6-ZyTuX.js";import{B as j}from"./Box-uNF0ND2L.js";import{S as r}from"./Grid-CTlAuf7X.js";import{S as C}from"./SearchType-BPBfpc5C.js";import{L as y}from"./List-B-MMhnOL.js";import{H as R}from"./DefaultResultListItem-B90H6jeX.js";import{O as I}from"./appWrappers-CYsST5ej.js";import{m as B}from"./makeStyles-CNV3hMKY.js";import{s as D,M as b}from"./api-DKL7dYhy.js";import{S as k}from"./SearchContext-U9kLs7rN.js";import{SearchBar as v}from"./SearchBar-CL5C-T9e.js";import{S as T}from"./SearchResult-BNBU6iL3.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BP40Z2wq.js";import"./Plugin-C--wn-xa.js";import"./componentData-VvhwuLFP.js";import"./useAnalytics-D_vtRMir.js";import"./useApp-C-T9q94R.js";import"./useRouteRef-lR_X8r_7.js";import"./ArrowForward-De2x7LP0.js";import"./translation-pyJsmzOb.js";import"./Page-BJJuTOWL.js";import"./useMediaQuery-RCIMYZo4.js";import"./Divider-D6wa_gko.js";import"./ArrowBackIos-BoK5svI9.js";import"./ArrowForwardIos-QIl4DeH3.js";import"./translation-C3f4O_Da.js";import"./Modal-DAR7GsXJ.js";import"./Portal-BgDfH8Z8.js";import"./Backdrop-CyxPS4lP.js";import"./styled-CoNMgIxM.js";import"./ExpandMore-Dy63TlFt.js";import"./useAsync-CsDFyt-v.js";import"./useMountedState-C9EMhPTC.js";import"./AccordionDetails-0bwbjF9s.js";import"./index-B9sM2jn7.js";import"./Collapse-P9G19jA8.js";import"./ListItem-B_oYa0lB.js";import"./ListContext-MI5-zAg3.js";import"./ListItemIcon-oyRan6I8.js";import"./ListItemText-Cc9q0K8Y.js";import"./Tabs-BbojancF.js";import"./KeyboardArrowRight-CY8FCg03.js";import"./FormLabel-C3Z0rJj_.js";import"./formControlState-D1Be7FHd.js";import"./InputLabel-DjWX1mI9.js";import"./Select-4PvEmGMm.js";import"./Popover-2iYb6kWG.js";import"./MenuItem-Bq0NnDem.js";import"./Checkbox-D26s0v4F.js";import"./SwitchBase-B5toueCm.js";import"./Chip-flVuIIc2.js";import"./Link-B2W3RHwT.js";import"./index-DGio2NzG.js";import"./lodash-BZMNBUXh.js";import"./WebStorage-D55CJE-6.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-D3Rsb0TV.js";import"./useIsomorphicLayoutEffect-X5l0eDKr.js";import"./BUIProvider-C0ob4iRY.js";import"./openLink-DneRJetG.js";import"./useResolvedHref-CZLqwSeY.js";import"./Search-DhiAHWWb.js";import"./useDebounce-Hpjyk8sF.js";import"./InputAdornment-6TqCZq8-.js";import"./TextField-COXa306r.js";import"./useElementFilter-CEqk68Vz.js";import"./EmptyState-DXmaY3PQ.js";import"./Progress-B4dA2ZN4.js";import"./LinearProgress-C8Q7CU4R.js";import"./ResponseErrorPanel-OA39Ihfu.js";import"./ErrorPanel-BznrtWfF.js";import"./WarningPanel-DpN0Gemn.js";import"./MarkdownContent-CKh6xxq9.js";import"./CodeSnippet-CAX0hgGz.js";import"./CopyTextButton-Dy069yQl.js";import"./useCopyToClipboard-BhSwuLby.js";import"./Tooltip-CdpWTf1d.js";import"./Popper-BHCCzf0k.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>I(t.jsx(h,{apis:[[D,new b(G)]],children:t.jsx(k,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(T,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
