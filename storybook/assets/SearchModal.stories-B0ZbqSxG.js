import{j as t,m as d,I as u,b as h,T as g}from"./iframe-DgkzaRcz.js";import{r as x}from"./plugin-Cl9I96LN.js";import{S as m,u as n,a as S}from"./useSearchModal-SZQMWpIL.js";import{B as c}from"./Button-DputNV-f.js";import{a as f,b as M,c as j}from"./DialogTitle-CLNs8i90.js";import{B as C}from"./Box-CjF3f9rs.js";import{S as r}from"./Grid-13HvIHxd.js";import{S as y}from"./SearchType-DkLZXPT8.js";import{L as I}from"./List-UtDCRpiD.js";import{H as R}from"./DefaultResultListItem-COLvKpXH.js";import{s as B,M as D}from"./api-BJ3-p9vs.js";import{S as T}from"./SearchContext-DGF8OHr8.js";import{w as k}from"./appWrappers-BBkmPso_.js";import{SearchBar as v}from"./SearchBar-DMRoVMV1.js";import{a as b}from"./SearchResult-CD0z4aSJ.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BH7N7lqx.js";import"./Plugin-Dd63G45J.js";import"./componentData-D6jwBdZo.js";import"./useAnalytics-qnTiS8hb.js";import"./useApp-Dd6zMmOH.js";import"./useRouteRef-CgaN9BS2.js";import"./index-BovWTFKo.js";import"./ArrowForward-Df-EQyM5.js";import"./translation-DjaxvO3q.js";import"./Page-_qLX4kSd.js";import"./useMediaQuery-DilCgI2m.js";import"./Divider-BsgTAdRC.js";import"./ArrowBackIos-BssgiAB5.js";import"./ArrowForwardIos-CFHaTKih.js";import"./translation-BoH2AF-k.js";import"./Modal-BMl9YgIm.js";import"./Portal-DiyW3rHr.js";import"./Backdrop-Do9s46dm.js";import"./styled-TNDgSIeW.js";import"./ExpandMore-Dxz0ockR.js";import"./useAsync-B6sI7pgh.js";import"./useMountedState-C4ChfPSk.js";import"./AccordionDetails-FigVUmDd.js";import"./index-B9sM2jn7.js";import"./Collapse-zjOOSLQm.js";import"./ListItem-D-dCGJEh.js";import"./ListContext-Bc5vGjYI.js";import"./ListItemIcon-DgBckAZa.js";import"./ListItemText-BTjp8q3D.js";import"./Tabs-D1IHKpdO.js";import"./KeyboardArrowRight-DYP0b2Iu.js";import"./FormLabel-Bz8mkRKR.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Cha8QXy2.js";import"./InputLabel-Hdp-talg.js";import"./Select-BnN-ghVl.js";import"./Popover-BOhX_6l5.js";import"./MenuItem-XzAP9_v_.js";import"./Checkbox-l1WyFc-8.js";import"./SwitchBase-TjDH3MPX.js";import"./Chip-DQW-kikY.js";import"./Link-CD76Rbm5.js";import"./lodash-Y_-RFQgK.js";import"./useObservable-UgjFkqx9.js";import"./useIsomorphicLayoutEffect-PH24tZgE.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-C0rh88Hw.js";import"./useDebounce-DwAn9iPE.js";import"./InputAdornment-EbTFnfaa.js";import"./TextField-D7Ulv7vB.js";import"./useElementFilter-DR2X3iet.js";import"./EmptyState-CQN_OyOL.js";import"./Progress-DHKAo1e3.js";import"./LinearProgress-CH1xl8Ne.js";import"./ResponseErrorPanel-CYjr1St8.js";import"./ErrorPanel-DxGQ0b0O.js";import"./WarningPanel-CQQNTNrV.js";import"./MarkdownContent-B2WHC1-q.js";import"./CodeSnippet-qrWrlZ1D.js";import"./CopyTextButton-BPmF_Ha2.js";import"./useCopyToClipboard-CcmaW2E0.js";import"./Tooltip-eP5YooZ3.js";import"./Popper-D8NH0TjN.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
