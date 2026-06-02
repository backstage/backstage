import{bR as t,u as d,l as u,a5 as h}from"./iframe-DogXi1kP.js";import{r as g}from"./plugin-BUMXfwm4.js";import{S as m,u as n,b as x}from"./useSearchModal-xDYQKA7X.js";import{B as c}from"./Button-BuZHMRa1.js";import{c as S,b as f,a as M}from"./DialogTitle-DlmkKiBu.js";import{B as j}from"./Box-CJxb0nPe.js";import{S as r}from"./Grid-D3we3n6C.js";import{S as C}from"./SearchType-DeBOjVtj.js";import{L as y}from"./List-DYZA-_Cd.js";import{H as R}from"./DefaultResultListItem-BSxEdWyW.js";import{O as I}from"./appWrappers-DIa0U7Su.js";import{m as B}from"./makeStyles-Bkm64Dpi.js";import{s as D,M as b}from"./api-pe4Jk8Pn.js";import{S as k}from"./SearchContext-OqF0SfrF.js";import{SearchBar as v}from"./SearchBar-NaYtByei.js";import{S as T}from"./SearchResult-BE99PVWH.js";import"./preload-helper-PPVm8Dsz.js";import"./index-P19etHCD.js";import"./Plugin-C47UInpE.js";import"./componentData-Bwbss29D.js";import"./useAnalytics-DWMKXBU9.js";import"./useApp-C6xgnwsj.js";import"./useRouteRef-CsjQ9_ph.js";import"./ArrowForward-DIiPbxIi.js";import"./translation-CWD1Kbbx.js";import"./Page-D3XwEBZU.js";import"./useMediaQuery-BfL73IaN.js";import"./Divider-DKbM6I94.js";import"./ArrowBackIos-DB051ni_.js";import"./ArrowForwardIos-C_dDfYn2.js";import"./translation-DhoBILl4.js";import"./Modal-QwMqv6xi.js";import"./Portal-DKOM2ljc.js";import"./Backdrop-DXn5Ezuk.js";import"./styled-LVo_tic8.js";import"./ExpandMore-8mGuFyUv.js";import"./useAsync-Dwi-mC7O.js";import"./useMountedState-38Jpwyxf.js";import"./AccordionDetails-BqX1TRD1.js";import"./index-B9sM2jn7.js";import"./Collapse-CE6sSAsi.js";import"./ListItem-BXUM3Mts.js";import"./ListContext-BOh0ZZsa.js";import"./ListItemIcon-BHNxXfXY.js";import"./ListItemText-BazddgN4.js";import"./Tabs-B2Uv5fbh.js";import"./KeyboardArrowRight-raMz7dAc.js";import"./FormLabel-NvNkqzZ1.js";import"./formControlState-DagtfhUg.js";import"./InputLabel-XG_Q-BYg.js";import"./Select-BGtOp27L.js";import"./Popover-BIeLO-69.js";import"./MenuItem-DR1znhj_.js";import"./Checkbox-DBB3w42E.js";import"./SwitchBase-CKp6PMnz.js";import"./Chip-JsGi1wI9.js";import"./Link-WtjewFfs.js";import"./index-DefuoSXt.js";import"./lodash-Bl4KCeDg.js";import"./WebStorage-DECTU3Ij.js";import"./isSymbol-BtnOBEK7.js";import"./isObject--vsEa_js.js";import"./toString-ls7O60t3.js";import"./useObservable-VC7b5PJX.js";import"./useIsomorphicLayoutEffect-BTO_Pw_I.js";import"./BUIProvider-coEk1xkK.js";import"./openLink-CxuZpafj.js";import"./useResolvedHref-BFQ7w248.js";import"./Search-U80wo99w.js";import"./useDebounce-2bL7MmBq.js";import"./InputAdornment-D0KDe81v.js";import"./TextField-amsZTFcv.js";import"./useElementFilter-DetdypbB.js";import"./EmptyState-D6K9iG1c.js";import"./Progress-DlmWEUd4.js";import"./LinearProgress-BrpROKyJ.js";import"./ResponseErrorPanel-DquXKOU7.js";import"./ErrorPanel-g9EGRzWu.js";import"./WarningPanel-D8YKjzYX.js";import"./MarkdownContent-CqaUVnqp.js";import"./CodeSnippet-Cxnl8e6a.js";import"./CopyTextButton-B4c5NjmN.js";import"./useCopyToClipboard-D2g3QE10.js";import"./Tooltip-D0UbP4zj.js";import"./Popper-C6PO9pUv.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>I(t.jsx(h,{apis:[[D,new b(G)]],children:t.jsx(k,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(T,{children:({results:p})=>t.jsx(y,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
