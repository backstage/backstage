import{j as t,m as d,I as u,b as h,T as g}from"./iframe-B6vHPHUS.js";import{r as x}from"./plugin-DQc5LMbC.js";import{S as m,u as n,a as S}from"./useSearchModal-BQH7kdsh.js";import{B as c}from"./Button-CJpRzj7y.js";import{a as f,b as M,c as j}from"./DialogTitle-B91uUjY7.js";import{B as C}from"./Box-BsuLuKk6.js";import{S as r}from"./Grid-BHnfM9BN.js";import{S as y}from"./SearchType-CIaoRPlF.js";import{L as I}from"./List-C19QDRq1.js";import{H as R}from"./DefaultResultListItem-6pzAzgb2.js";import{s as B,M as D}from"./api-C-mL8dKS.js";import{S as T}from"./SearchContext-BpiouIkX.js";import{w as k}from"./appWrappers-m0dyImYt.js";import{SearchBar as v}from"./SearchBar-G3g4O2Td.js";import{a as b}from"./SearchResult-ClpbgTuH.js";import"./preload-helper-D9Z9MdNV.js";import"./index-CxyDHaXg.js";import"./Plugin-uDhfna-s.js";import"./componentData-Ck-liOWv.js";import"./useAnalytics-CHRs9F0l.js";import"./useApp-c9Cmx9JK.js";import"./useRouteRef-_QxqMNzn.js";import"./index-CG8HQpK_.js";import"./ArrowForward-B1fZSS8q.js";import"./translation-adfaX7kw.js";import"./Page-BY1gpxFq.js";import"./useMediaQuery-B4U0XxuS.js";import"./Divider-PYX69q2N.js";import"./ArrowBackIos-CKV6z2YS.js";import"./ArrowForwardIos-BzQM4a4L.js";import"./translation-CTFPAqDU.js";import"./Modal-BadxeSQ1.js";import"./Portal-DQJrkvBY.js";import"./Backdrop-khO5dm31.js";import"./styled-BNzka1pC.js";import"./ExpandMore-B0SFV6c5.js";import"./useAsync-CtKW-R0u.js";import"./useMountedState-4spEAOpb.js";import"./AccordionDetails-B-VwfNtv.js";import"./index-DnL3XN75.js";import"./Collapse-CIMX6SDT.js";import"./ListItem-BxDrZyrD.js";import"./ListContext-D8DpMZfT.js";import"./ListItemIcon-BFkyMXV-.js";import"./ListItemText-BE9Uflaf.js";import"./Tabs-C5A5Scu8.js";import"./KeyboardArrowRight-Bbr1rybk.js";import"./FormLabel-D_770mFO.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-B8k-6ghs.js";import"./InputLabel-CuDSj0Lj.js";import"./Select-psTXzcAQ.js";import"./Popover-CBmXs0vj.js";import"./MenuItem-D6E9BD6T.js";import"./Checkbox-BCXRv9zx.js";import"./SwitchBase-BC6VPVu3.js";import"./Chip-DVrU94NQ.js";import"./Link-BCwjV0MZ.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-Cj9WRojc.js";import"./useIsomorphicLayoutEffect-CWw7s17H.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-Dc59OGjz.js";import"./useDebounce-F2nZrB7B.js";import"./InputAdornment-BCxrn5FM.js";import"./TextField-BE4yNrH2.js";import"./useElementFilter-DuNyKDqx.js";import"./EmptyState-5BnGrMHu.js";import"./Progress-OrcUOgr2.js";import"./LinearProgress-DBlH8prv.js";import"./ResponseErrorPanel-beR4crPZ.js";import"./ErrorPanel-B64V3zAe.js";import"./WarningPanel-C9caxC0h.js";import"./MarkdownContent-D1AHxM79.js";import"./CodeSnippet-CV4g9JLu.js";import"./CopyTextButton-DuiMHNoR.js";import"./useCopyToClipboard-DyRiVU--.js";import"./Tooltip-BKT0sHqR.js";import"./Popper-0ce0RW6i.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
