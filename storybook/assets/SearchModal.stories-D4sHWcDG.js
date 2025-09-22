import{j as t,m as d,I as u,b as h,T as g}from"./iframe-hvh2aMf9.js";import{r as x}from"./plugin-D64ROlJ2.js";import{S as m,u as n,a as S}from"./useSearchModal-CiIu9Dmp.js";import{B as c}from"./Button-DCfJTuUb.js";import{a as f,b as M,c as j}from"./DialogTitle-GCc4cGcE.js";import{B as C}from"./Box-BjIjXY28.js";import{S as r}from"./Grid-DbJ44Ewx.js";import{S as y}from"./SearchType-CcwJ-ZB7.js";import{L as I}from"./List-74W1l74F.js";import{H as R}from"./DefaultResultListItem-DdBEtX50.js";import{s as B,M as D}from"./api-BNBMsT4i.js";import{S as T}from"./SearchContext-DNannncv.js";import{w as k}from"./appWrappers-Br-zmgYb.js";import{SearchBar as v}from"./SearchBar-B_RPJr7X.js";import{a as b}from"./SearchResult-CmxOm-9I.js";import"./preload-helper-D9Z9MdNV.js";import"./index-ChEhYZD7.js";import"./Plugin-BVqzn08d.js";import"./componentData-DJ30wAD0.js";import"./useAnalytics-CVphDHTH.js";import"./useApp-CqXr_4Cz.js";import"./useRouteRef-CAeo51pw.js";import"./index-7QU1_rFp.js";import"./ArrowForward-DlduA0Ms.js";import"./translation-QLgkwN8D.js";import"./Page-Dc5fsIoj.js";import"./useMediaQuery-B1wWzBj6.js";import"./Divider-D1DdZhOv.js";import"./ArrowBackIos-Bx-rRpOY.js";import"./ArrowForwardIos-CTyu-hXk.js";import"./translation-nDR5XFKZ.js";import"./Modal-D7enm8Ov.js";import"./Portal-Bb9zcDOK.js";import"./Backdrop-B_m0crbj.js";import"./styled-CsVOCgfV.js";import"./ExpandMore-nelLsYHb.js";import"./useAsync-DTXafnw5.js";import"./useMountedState-CuwT9qKs.js";import"./AccordionDetails-DLZ6dsCT.js";import"./index-DnL3XN75.js";import"./Collapse-PeWKU6hc.js";import"./ListItem-CXtueEiL.js";import"./ListContext-DMJfGJuk.js";import"./ListItemIcon-Cu_92qKe.js";import"./ListItemText-Cnvrb4zg.js";import"./Tabs-DYQr_FYJ.js";import"./KeyboardArrowRight-Z-YkqVn8.js";import"./FormLabel-Dbp9-9jn.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-BR5gSDSV.js";import"./InputLabel-DpPc-Cth.js";import"./Select-C81yUSPF.js";import"./Popover-DO-qvFaR.js";import"./MenuItem-bpLkcWO4.js";import"./Checkbox-kONtCat5.js";import"./SwitchBase-MdywNRF2.js";import"./Chip-Dlibf27G.js";import"./Link-CHVET8I2.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-BBWREk27.js";import"./useIsomorphicLayoutEffect-BrJ5WAHL.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-B8byk5xf.js";import"./useDebounce-CLpTgdgK.js";import"./InputAdornment-C8O1tYwm.js";import"./TextField-DCGZEAm-.js";import"./useElementFilter-B5SxWpWz.js";import"./EmptyState-CGnMmvnq.js";import"./Progress-xUG6Wg7g.js";import"./LinearProgress-cUA0lW5M.js";import"./ResponseErrorPanel-DU4ndfKc.js";import"./ErrorPanel-DykIF4Ux.js";import"./WarningPanel-CJ_nUs4N.js";import"./MarkdownContent-DCK-3Ric.js";import"./CodeSnippet-5nQo7gNl.js";import"./CopyTextButton-FOvJ_Vam.js";import"./useCopyToClipboard-D9VM6fel.js";import"./Tooltip-Y5wSFqY4.js";import"./Popper-CHxzJWK6.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
