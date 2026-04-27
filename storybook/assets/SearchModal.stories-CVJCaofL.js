import{j as t,W as d,a3 as u,a2 as h}from"./iframe-BOELprFv.js";import{r as g}from"./plugin-BpS2NmNQ.js";import{S as l,u as n,a as x}from"./useSearchModal-BzLH2oDe.js";import{B as c}from"./Button-BgXfEUhv.js";import{D as S,a as f,b as M}from"./DialogTitle-BzLCB6lk.js";import{B as j}from"./Box-DfaVDnxz.js";import{S as r}from"./Grid-CH5PqTNF.js";import{S as C}from"./SearchType-DwQ_LQTz.js";import{L as y}from"./List-j_RiqkVh.js";import{H as I}from"./DefaultResultListItem-HwfNHCmK.js";import{w as R}from"./appWrappers-CEl2Ow7o.js";import{m as B}from"./makeStyles-CSWS6G8b.js";import{s as D,M as k}from"./api-VTpynOT_.js";import{S as v}from"./SearchContext-XCyLugQa.js";import{SearchBar as T}from"./SearchBar-C0pE8dVL.js";import{S as b}from"./SearchResult-DzznjvKe.js";import"./preload-helper-PPVm8Dsz.js";import"./index-B2u1vAKH.js";import"./Plugin-CSZJYMuj.js";import"./componentData-DXRZVCfF.js";import"./useAnalytics-BJhOaRVB.js";import"./useApp-7Kwzc3rd.js";import"./useRouteRef-CcqJk9jr.js";import"./ArrowForward-TJKCguZG.js";import"./translation-BzBUM6Lu.js";import"./Page-dlNZdOp0.js";import"./useMediaQuery-LRUpMN7w.js";import"./Divider-CYs6LHZd.js";import"./ArrowBackIos-D1hNdztG.js";import"./ArrowForwardIos-D3ZU5jGt.js";import"./translation-BwbvaU23.js";import"./Modal-BJvjIkRj.js";import"./Portal-DWJfagAU.js";import"./Backdrop-LohNO5YD.js";import"./styled-B9TjYplk.js";import"./ExpandMore-CeVFAaVG.js";import"./useAsync-DhMveIGN.js";import"./useMountedState-B_d8GdoW.js";import"./AccordionDetails-DJi0nM9u.js";import"./index-B9sM2jn7.js";import"./Collapse-Bi9pfq6r.js";import"./ListItem-ByTdyqTk.js";import"./ListContext-IUdz5Dmy.js";import"./ListItemIcon-BTcHpD-9.js";import"./ListItemText-DFIr4HdJ.js";import"./Tabs-BOPtSeYf.js";import"./KeyboardArrowRight-4j78cfaz.js";import"./FormLabel-BpnAnYRD.js";import"./formControlState-D3tH8cjE.js";import"./InputLabel-CrJniIJl.js";import"./Select-SuEW4Z4L.js";import"./Popover-Cr3nyACi.js";import"./MenuItem-B0o8WK2K.js";import"./Checkbox-tOVHRzqt.js";import"./SwitchBase-Cu9ZdNKJ.js";import"./Chip-BbhJQ5Fv.js";import"./Link-BwYnYGUx.js";import"./index-B4exrKOF.js";import"./lodash-DvkL6iKH.js";import"./WebStorage-Ck90zCQN.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./useObservable-CDnTt6Oa.js";import"./useIsomorphicLayoutEffect-DcG3e63B.js";import"./BUIProvider-BVnThpam.js";import"./openLink-OWDAQw2O.js";import"./useResolvedHref-BWB2xz1Y.js";import"./Search-L36dOxQ3.js";import"./useDebounce-BaKxG0Wm.js";import"./InputAdornment-Bbh8ta5r.js";import"./TextField-CNlhTBkx.js";import"./useElementFilter-8r9t1fC7.js";import"./EmptyState-DHk_Bh53.js";import"./Progress-Bm5vgsbo.js";import"./LinearProgress-Elx0sqSC.js";import"./ResponseErrorPanel-Bi4VGTVu.js";import"./ErrorPanel-BX4gje7O.js";import"./WarningPanel-gBQydIWZ.js";import"./MarkdownContent-CU1C2Ktg.js";import"./CodeSnippet-CSsor0Bd.js";import"./CopyTextButton-DnL4XEYg.js";import"./useCopyToClipboard-lbUBEzRz.js";import"./Tooltip-CNoLi4pN.js";import"./Popper-ehh25wyz.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},co={title:"Plugins/Search/SearchModal",component:l,decorators:[o=>R(t.jsx(h,{apis:[[D,new k(G)]],children:t.jsx(v,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":g}})],tags:["!manifest"]},i=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(l,{...o,toggleModal:a})]})},A=B(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),s=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(l,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(S,{children:t.jsxs(j,{className:o.titleContainer,children:[t.jsx(T,{className:o.input}),t.jsx(d,{"aria-label":"close",onClick:e,children:t.jsx(u,{})})]})}),t.jsx(f,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(C.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(y,{children:p.map(({document:m})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(I,{result:m},m.location)},`${m.location}-btn`))})})})]})}),t.jsx(M,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(x,{})})})})]})})]})};i.__docgenInfo={description:"",methods:[],displayName:"Default"};s.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};i.parameters={...i.parameters,docs:{...i.parameters?.docs,source:{originalSource:`() => {
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
