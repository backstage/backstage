import{j as t,m as d,I as u,b as h,T as g}from"./iframe-nUyzSU_S.js";import{r as x}from"./plugin-ZHlQDInf.js";import{S as m,u as n,a as S}from"./useSearchModal-C40apf3g.js";import{B as c}from"./Button-9eN5S7Qm.js";import{a as f,b as M,c as j}from"./DialogTitle-CrBmctvX.js";import{B as C}from"./Box-CplorJ0g.js";import{S as r}from"./Grid-DwDNjNmk.js";import{S as y}from"./SearchType-ipyj9LN2.js";import{L as I}from"./List-D6JW15z2.js";import{H as R}from"./DefaultResultListItem-9keH2EV8.js";import{s as B,M as D}from"./api-DmT-dUSt.js";import{S as T}from"./SearchContext-DyxwDLO3.js";import{w as k}from"./appWrappers-uUi70V5A.js";import{SearchBar as v}from"./SearchBar-1NMzPn06.js";import{a as b}from"./SearchResult-BXppCCas.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BgtUWLdO.js";import"./Plugin-BL-ThqI6.js";import"./componentData-BtNz5bOU.js";import"./useAnalytics-zfcNJTQf.js";import"./useApp-BPL8rQQ0.js";import"./useRouteRef-DTrAK6VX.js";import"./index-RHyzx4fN.js";import"./ArrowForward-CpJlCC58.js";import"./translation-BKIh49re.js";import"./Page-DaZ2zZHW.js";import"./useMediaQuery-BaVSkscO.js";import"./Divider-B2c5GnvR.js";import"./ArrowBackIos-ATegL5xe.js";import"./ArrowForwardIos-lqZiqWjH.js";import"./translation-C2YrA5Zm.js";import"./Modal-CyZtSQZC.js";import"./Portal-B4a8gD0I.js";import"./Backdrop-D6as2G6O.js";import"./styled-D6A2oy1q.js";import"./ExpandMore-DrwTQ_nT.js";import"./useAsync-D2jbTAhU.js";import"./useMountedState-Ck7bTrxM.js";import"./AccordionDetails-BqLvXOa3.js";import"./index-B9sM2jn7.js";import"./Collapse-Qq71ZV2-.js";import"./ListItem-PgZpHMG5.js";import"./ListContext-CXea3Vhu.js";import"./ListItemIcon-CreGnifE.js";import"./ListItemText-Bd0mukYB.js";import"./Tabs-Cg09xHiL.js";import"./KeyboardArrowRight-BUjtkXdz.js";import"./FormLabel-CEGYyYsb.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-Bys_1h5X.js";import"./InputLabel-D_m6rx0v.js";import"./Select-CXSzpRz_.js";import"./Popover-CqQntd3a.js";import"./MenuItem-BMH_FEfJ.js";import"./Checkbox-Bex-TVJm.js";import"./SwitchBase-hPx19eFa.js";import"./Chip-WldIaaP4.js";import"./Link-Dwrts35l.js";import"./lodash-Y_-RFQgK.js";import"./useObservable-D1hu37r5.js";import"./useIsomorphicLayoutEffect-DDHF-UnU.js";import"./isSymbol-DYihM2bc.js";import"./isObject--vsEa_js.js";import"./toString-jlmj72dF.js";import"./Search-BPU9_Plx.js";import"./useDebounce-CjIod6UB.js";import"./InputAdornment-CBJ4cAd8.js";import"./TextField-D2Fg4uQX.js";import"./useElementFilter-DPd0wIOL.js";import"./EmptyState-C2wNmqjw.js";import"./Progress-CGF2X05Y.js";import"./LinearProgress-C4eMO61C.js";import"./ResponseErrorPanel-BtI5pN11.js";import"./ErrorPanel-Dv6LBRqb.js";import"./WarningPanel-T0yxH3Lf.js";import"./MarkdownContent-CmKSX4Zr.js";import"./CodeSnippet-DiaoCVk2.js";import"./CopyTextButton--QRyALeY.js";import"./useCopyToClipboard-CaxGIeMo.js";import"./Tooltip-HC5n3ZHa.js";import"./Popper-DpFVguQf.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
