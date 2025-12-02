import{j as t,m as d,I as u,b as h,T as g}from"./iframe-C773ayyW.js";import{r as x}from"./plugin-DPT5L4ox.js";import{S as m,u as n,a as S}from"./useSearchModal-I-oxzUio.js";import{B as c}from"./Button-gX2CQaIh.js";import{a as f,b as M,c as j}from"./DialogTitle-C7AhKUgT.js";import{B as C}from"./Box-c_uSXZkq.js";import{S as r}from"./Grid-oO_1iSro.js";import{S as y}from"./SearchType-4a9v8jya.js";import{L as I}from"./List-BAYQ25-v.js";import{H as R}from"./DefaultResultListItem-CC7UrR10.js";import{s as B,M as D}from"./api-CDEXucDH.js";import{S as T}from"./SearchContext-BgnwhBSz.js";import{w as k}from"./appWrappers-DrF6lruE.js";import{SearchBar as v}from"./SearchBar-B5xpDO8O.js";import{a as b}from"./SearchResult-CuH__FE7.js";import"./preload-helper-D9Z9MdNV.js";import"./index-ilx6tCZY.js";import"./Plugin-DgheCK0L.js";import"./componentData-Bdgmno7t.js";import"./useAnalytics-BUXUfjUP.js";import"./useApp-p5rHYLk0.js";import"./useRouteRef-BO68tLin.js";import"./index-B7-NdQX-.js";import"./ArrowForward-DJtOLu8h.js";import"./translation-BfXJFQjb.js";import"./Page-BUVnWZDJ.js";import"./useMediaQuery-9UL9YuF5.js";import"./Divider-DsftiJpK.js";import"./ArrowBackIos-CiVVd8x0.js";import"./ArrowForwardIos-DWA62wNq.js";import"./translation-BqQdceUK.js";import"./Modal-t1QUaF78.js";import"./Portal-CQJvHB_7.js";import"./Backdrop-CZK56ZrR.js";import"./styled-EjF9N2BZ.js";import"./ExpandMore-Dc64qUSO.js";import"./useAsync-Dnv3cfj8.js";import"./useMountedState-BaRlQShP.js";import"./AccordionDetails-CDPX87gH.js";import"./index-DnL3XN75.js";import"./Collapse-CHxej2af.js";import"./ListItem-ByJ_H4o2.js";import"./ListContext-BwXeXg0F.js";import"./ListItemIcon-Dh3Gi0ic.js";import"./ListItemText-DjaDs-4M.js";import"./Tabs-lTNlshnB.js";import"./KeyboardArrowRight-B6jeFfJX.js";import"./FormLabel-ydHejLi2.js";import"./formControlState-ByiNFc8I.js";import"./useFormControl-xPXTvgal.js";import"./InputLabel-DbIYSzoW.js";import"./Select-BlqkwCO1.js";import"./Popover-BpAOnTzO.js";import"./MenuItem-BKoal5yo.js";import"./Checkbox-DmYcTblD.js";import"./SwitchBase-CBsenC9D.js";import"./Chip-Dz3kZOQ4.js";import"./Link-88zF7xCS.js";import"./lodash-CwBbdt2Q.js";import"./useObservable-BD2eLMSd.js";import"./useIsomorphicLayoutEffect-fSTRkWZD.js";import"./isSymbol-DhO4cmIY.js";import"./isObject--vsEa_js.js";import"./toString-Cr1IARFv.js";import"./Search-CkCpWc3x.js";import"./useDebounce-BvSFJkFg.js";import"./InputAdornment-t9BF54db.js";import"./TextField-DkQMGmRa.js";import"./useElementFilter-YP4KIN5q.js";import"./EmptyState-ILcOScsl.js";import"./Progress-BYa0Wco5.js";import"./LinearProgress-DyMFBSmI.js";import"./ResponseErrorPanel-DL8Gz1Lm.js";import"./ErrorPanel-DHXJzEMk.js";import"./WarningPanel-CSA5ach2.js";import"./MarkdownContent-ebJNHJdy.js";import"./CodeSnippet-C_E6kwNC.js";import"./CopyTextButton-DKZ84MGL.js";import"./useCopyToClipboard-CtMXT3me.js";import"./Tooltip-BuBe4fE-.js";import"./Popper-C-ZRE_0u.js";const G={results:[{type:"custom-result-item",document:{location:"search/search-result-1",title:"Search Result 1",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-2",title:"Search Result 2",text:"some text from the search result"}},{type:"no-custom-result-item",document:{location:"search/search-result-3",title:"Search Result 3",text:"some text from the search result"}}]},ao={title:"Plugins/Search/SearchModal",component:m,decorators:[o=>k(t.jsx(g,{apis:[[B,new D(G)]],children:t.jsx(T,{children:t.jsx(o,{})})}),{mountedRoutes:{"/search":x}})]},s=()=>{const{state:o,toggleModal:a}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:a,children:"Toggle Search Modal"}),t.jsx(m,{...o,toggleModal:a})]})},A=d(o=>({titleContainer:{display:"flex",alignItems:"center",gap:o.spacing(1)},input:{flex:1},dialogActionsContainer:{padding:o.spacing(1,3)}})),i=()=>{const o=A(),{state:a,toggleModal:e}=n();return t.jsxs(t.Fragment,{children:[t.jsx(c,{variant:"contained",color:"primary",onClick:e,children:"Toggle Custom Search Modal"}),t.jsx(m,{...a,toggleModal:e,children:()=>t.jsxs(t.Fragment,{children:[t.jsx(f,{children:t.jsxs(C,{className:o.titleContainer,children:[t.jsx(v,{className:o.input}),t.jsx(u,{"aria-label":"close",onClick:e,children:t.jsx(h,{})})]})}),t.jsx(M,{children:t.jsxs(r,{container:!0,direction:"column",children:[t.jsx(r,{item:!0,children:t.jsx(y.Tabs,{defaultValue:"",types:[{value:"custom-result-item",name:"Custom Item"},{value:"no-custom-result-item",name:"No Custom Item"}]})}),t.jsx(r,{item:!0,children:t.jsx(b,{children:({results:p})=>t.jsx(I,{children:p.map(({document:l})=>t.jsx("div",{role:"button",tabIndex:0,onClick:e,onKeyPress:e,children:t.jsx(R,{result:l},l.location)},`${l.location}-btn`))})})})]})}),t.jsx(j,{className:o.dialogActionsContainer,children:t.jsx(r,{container:!0,direction:"row",children:t.jsx(r,{item:!0,xs:12,children:t.jsx(S,{})})})})]})})]})};s.__docgenInfo={description:"",methods:[],displayName:"Default"};i.__docgenInfo={description:"",methods:[],displayName:"CustomModal"};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`() => {
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
