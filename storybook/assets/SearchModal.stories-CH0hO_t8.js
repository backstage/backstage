import{j as t,m as d,I as u,b as h,T as g}from"./iframe-omS-VfEE.js";import{r as x}from"./plugin-_6NABpqd.js";import{S as m,u as n,a as S}from"./useSearchModal-CdawO4hf.js";import{B as c}from"./Button-cwljLBUl.js";import{a as f,b as M,c as j}from"./DialogTitle-CbcbXP0z.js";import{B as C}from"./Box-CkfuSc_q.js";import{S as r}from"./Grid-BYUcu-HN.js";import{S as y}from"./SearchType-BQpLfQsV.js";import{L as I}from"./List-C9vsaZyo.js";import{H as R}from"./DefaultResultListItem-xelaaCHi.js";import{s as B,M as D}from"./api-BPHn8KSC.js";import{S as T}from"./SearchContext-BqCLLorT.js";import{w as k}from"./appWrappers-D_rcKu23.js";import{SearchBar as v}from"./SearchBar-CIEnDsNf.js";import{a as b}from"./SearchResult-zRS3UPpm.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CxYQenE5.js";import"./Plugin-CgzkpFyB.js";import"./componentData-rUfARfxE.js";import"./useAnalytics-DpXUy368.js";import"./useApp-DFGFX2A_.js";import"./useRouteRef-Q1h4R6gV.js";import"./index-BJYML3pb.js";import"./ArrowForward-Q3VMHoWX.js";import"./translation-BOFuybj1.js";import"./Page-D6VOo8ns.js";import"./useMediaQuery-CmLzCGth.js";import"./Divider-B1hRM44o.js";import"./ArrowBackIos-BMTeecMh.js";import"./ArrowForwardIos-CevlVso1.js";import"./translation-Kq0oWun5.js";import"./Modal-BJT6EnpA.js";import"./Portal-tl-MtD9Q.js";import"./Backdrop-peojPdzD.js";import"./styled-D7Xcwibq.js";import"./ExpandMore-B7pPANEl.js";import"./useAsync-XDPyEQBh.js";import"./useMountedState-B72_4ZkH.js";import"./AccordionDetails-BhNEpOi0.js";import"./index-B9sM2jn7.js";import"./Collapse-BMfiGGQz.js";import"./ListItem-CyW2KymL.js";import"./ListContext-CkIdZQYa.js";import"./ListItemIcon-uG6Zdidr.js";import"./ListItemText-pfsweG72.js";import"./Tabs-YhsM_1GP.js";import"./KeyboardArrowRight-GaQDrkvc.js";import"./FormLabel-CMRKpa-Z.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-CCoK0o0X.js";import"./InputLabel-DTyloQDa.js";import"./Select-cBs4AoEA.js";import"./Popover-CrWWJ3tC.js";import"./MenuItem-B-ZJdPwj.js";import"./Checkbox-B25j5ajB.js";import"./SwitchBase-CHLia2ma.js";import"./Chip-3VxfBCLo.js";import"./Link-BWOCx2Nz.js";import"./lodash-Y_-RFQgK.js";import"./useObservable-CWiuwahj.js";import"./useIsomorphicLayoutEffect-NeOa0wWc.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-DbtJ8bIy.js";import"./useDebounce-Bc2sPXiU.js";import"./InputAdornment-bPFuIuMx.js";import"./TextField-KC2YsO6S.js";import"./useElementFilter-BN32wk0X.js";import"./EmptyState-CGlrVQ4p.js";import"./Progress-DKbNvoZJ.js";import"./LinearProgress-BweHx2gc.js";import"./ResponseErrorPanel-CR-W8fzn.js";import"./ErrorPanel-NSHOjdDK.js";import"./WarningPanel-BpYFzcLR.js";import"./MarkdownContent-CrQrCbdZ.js";import"./CodeSnippet-D7viEsWF.js";import"./CopyTextButton-Dpc4LkrT.js";import"./useCopyToClipboard-fqzv143-.js";import"./Tooltip-ER_nPOs0.js";import"./Popper-DnFnSudK.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
